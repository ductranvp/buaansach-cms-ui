<template>
  <el-container direction="vertical">
    <div>
      <el-row :gutter="10">
        <el-col :span="10">
          <el-input
            placeholder="Tìm theo mã, tên đăng nhập hoặc tên hiển thị"
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
            <el-dropdown trigger="click" :hide-on-click="false">
              <el-button class="margin-right-10"><span>Hiển thị</span></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="key in Object.keys(columns)" :key="key">
                  <el-checkbox v-model="columns[key].display">{{columns[key].label}}</el-checkbox>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button type="primary" @click="createUser">
              <span>{{ $t("common.entity.action.create") }}</span>
            </el-button>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="margin-top-10">
      <data-table
        show-index
        ref="userTable"
        :default-sort="{prop: 'createdDate', order: 'ascending'}"
        :fetch-data="fetchData"
        :filter="filter"
      >
        <template slot="expand">
          <el-table-column type="expand">
            <template slot-scope="{row}">
              <admin-user-row-detail :row="row"/>
            </template>
          </el-table-column>
        </template>
        <template v-for="key in Object.keys(columns)">
          <el-table-column :key="key" :prop="key" :label="columns[key].label" v-if="columns[key].display"
                           :sortable="columns[key].sortable">
            <template slot-scope="{row}">
              <div v-if="columns[key].type === 'time'">
                <span v-if="row[key]">{{row[key] | moment("HH:mm DD/MM/YYYY")}}</span>
              </div>
              <div v-else class="no-break-word text-single-line">
                <span>{{row[key]}}</span>
              </div>
            </template>
          </el-table-column>
        </template>
        <el-table-column prop="authorities" label="Quyền" width="160px">
          <template slot-scope="{row}">
            <el-tooltip content="Quản trị viên" v-if="row.authorities.includes('ROLE_ADMIN')">
              <span class="text-large padding-5 text-primary">
                <i class="fas el-icon-fa-user-shield"></i>
              </span>
            </el-tooltip>
            <el-tooltip content="Điều hành viên" v-if="row.authorities.includes('ROLE_MODERATOR')">
              <span class="text-large padding-5 text-warning">
              <i class="fas el-icon-fa-user-cog"></i>
              </span>
            </el-tooltip>
            <el-tooltip content="Chăm sóc khách hàng" v-if="row.authorities.includes('ROLE_CUSTOMER_CARE')">
              <span class="text-large padding-5 text-success">
              <i class="fas el-icon-fa-headset"></i>
              </span>
            </el-tooltip>
            <el-tooltip content="Người dùng" v-if="row.authorities.includes('ROLE_USER')">
              <span class="text-large padding-5">
              <i class="fas el-icon-fa-user"></i>
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
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
        <template slot="action">
          <el-table-column width="130px" label="Thao tác">
            <template slot-scope="{ row }">
              <el-dropdown>
                <el-button size="mini"
                           type="warning"
                           plain>
                  Chọn<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="editUser(row)">Cập nhật thông tin</el-dropdown-item>
                  <el-dropdown-item @click.native="handleChangePassword(row)">Đổi mật khẩu</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </template>
      </data-table>
    </div>
    <create-or-update-user-dialog @saved="reloadTableData" ref="userDialog"/>
  </el-container>
</template>

<script>
  import CreateOrUpdateUserDialog from "@/views/private/admin/user/CreateOrUpdateUserDialog";
  import AdminUserService from "@/service/admin/admin.user.service";
  import DataTable from "@/components/data-table/DataTable";
  import {mapState} from "vuex";
  import NotificationUtils from "@/utils/notification.util";
  import MessageUtils from "@/utils/message.util";
  import AdminUserRowDetail from "@/views/private/admin/user/AdminUserRowDetail";

  export default {
    name: "AdminUserManagement",
    components: {AdminUserRowDetail, DataTable, CreateOrUpdateUserDialog},
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
        },
        columns: {
          login: {label: 'Tên đăng nhập', display: true, sortable: true},
          lastName: {label: 'Họ', display: true},
          firstName: {label: 'Tên', display: true},
          email: {label: 'Email', display: true},
          phone: {label: 'SĐT', display: false},
          createdBy: {label: 'Người tạo', display: false},
          createdDate: {label: 'Ngày tạo', display: false, type: 'time', sortable: true},
          lastModifiedBy: {label: 'Người sửa cuối', display: false},
          lastModifiedDate: {label: 'Ngày sửa cuối', display: false, type: 'time', sortable: true},
        },
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
        vm.filter.searchKey = vm.searchKey;
        vm.isLoading = true;
        vm.$refs.userTable.reload(whenDone);

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
                MessageUtils.success("Đổi mật khẩu thành công");
              } catch (error) {
                MessageUtils.error(error.message || error.data.message);
              }
            } else {
              MessageUtils.error("Mật khẩu phải có độ dài 4-100 kí tự");
            }
          })
          .catch(() => {
          });
      }
    }
  };
</script>

<style scoped></style>
