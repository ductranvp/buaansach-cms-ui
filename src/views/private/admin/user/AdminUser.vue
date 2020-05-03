<template>
  <el-container direction="vertical">
    <div>
      <el-row :gutter="10">
        <el-col :span="10">
          <el-input
            placeholder="Nhập họ tên hoặc tên đăng nhập của người dùng"
            v-model="searchKey"
            @keypress.enter.native="onSearch"
          >
            <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button :loading="isLoading" @click="reloadTableData" icon="el-icon-refresh">
            <span>{{ $t("common.entity.action.refresh") }}</span>
          </el-button>
        </el-col>
        <el-col :span="10">
          <el-row type="flex" justify="end">
            <el-button type="primary" @click="createUser">
              <span>{{ $t("common.entity.action.create") }}</span>
            </el-button>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="margin-top-10">
      <data-table
        ref="userTable"
        :fetch-data="fetchData"
        :filter="filter"
        show-audit
        :custom-audit="['createdBy', 'createdDate']"
      >
        <el-table-column prop="login" label="Tên đăng nhập"></el-table-column>
        <el-table-column prop="firstName" label="Tên"></el-table-column>
        <el-table-column prop="lastName" label="Họ"></el-table-column>
        <el-table-column prop="email" label="Email"></el-table-column>
        <el-table-column prop="phone" label="SĐT"></el-table-column>
        <el-table-column prop="activated" label="Trạng thái">
          <template slot-scope="{row}">
            <el-button :disabled="currentUser.login === row.login" size="small" type="success"
                       @click="handleActivation(row)" v-if="row.activated">
              {{ $t("private.adminStoreDetailHumanPage.accountStatus.activated") }}
            </el-button>
            <el-button size="small" type="danger" @click="handleActivation(row)" v-else>
              {{ $t("private.adminStoreDetailHumanPage.accountStatus.deactivated") }}
            </el-button>
          </template>
        </el-table-column>
<!--        <el-table-column prop="langKey" label="Ngôn ngữ"></el-table-column>-->
        <template slot="action">
          <el-table-column width="130px" label="Thao tác">
            <template slot-scope="{ row }">
              <el-button
                size="mini"
                type="warning"
                plain
                @click="handleChangePassword(row)"
              >
                <span>Đổi mật khẩu</span>
              </el-button>
            </template>
          </el-table-column>
        </template>
      </data-table>
    </div>
    <create-or-update-user-dialog ref="userDialog"/>
  </el-container>
</template>

<script>
  import CreateOrUpdateUserDialog from "@/views/private/admin/user/CreateOrUpdateUserDialog";
  import AdminUserService from "@/service/admin/admin.user.service";
  import DataTable from "@/components/data-table/DataTable";
  import {mapState} from "vuex";
  import NotificationUtils from "@/utils/notification.util";

  export default {
    name: "AdminUserManagement",
    components: {DataTable, CreateOrUpdateUserDialog},
    computed: {
      ...mapState({
        currentUser: state => state.user.info
      })
    },
    data() {
      return {
        isLoading: false,
        searchKey: "",
        filter: {
          searchKey: ""
        }
      };
    },
    methods: {
      createUser() {
        this.$refs.userDialog.create();
      },
      editUser(user) {
        this.$refs.userDialog.edit(user);
      },
      reloadTableData() {
        const vm = this;
        vm.isLoading = true;
        this.$refs.userTable.reload(whenDone);

        function whenDone() {
          vm.isLoading = false;
        }
      },
      onSearch() {
        /* change filter property to trigger DataTable filter */
        this.filter.searchKey = this.searchKey;
      },
      fetchData(params) {
        return AdminUserService.getPageUser(params);
      },
      async handleActivation(row) {
        try {
          await AdminUserService.toggleActivation(row.login);
          row.activated = !row.activated;
        } catch (error) {
          NotificationUtils.error(error.message || error.data.message);
        }
      },
      handleChangePassword(row) {
        this.$prompt("Nhập vào mật khẩu mới cho '" + row.login + "'", "Đổi mật khẩu", {
          confirmButtonText: this.$t("app.messageBox.okBtn"),
          cancelButtonText: this.$t("app.messageBox.cancelBtn"),
          inputValue: "",
          inputType: "password",
          dangerouslyUseHTMLString: false
        })
          .then(async cb => {
            if (cb.value && cb.value.length >= 4 && cb.value.length <= 100) {
              const payload = {
                login: row.login,
                newPassword: cb.value
              };
              try {
                await AdminUserService.changePassword(payload);
                NotificationUtils.success("Đổi mật khẩu thành công");
              } catch (error) {
                NotificationUtils.error(error.message || error.data.message);
              }
            } else {
              NotificationUtils.error("Mật khẩu phải có độ dài 4-100 kí tự");
            }
          })
          .catch(() => {
          });
      }
    }
  };
</script>

<style scoped></style>
