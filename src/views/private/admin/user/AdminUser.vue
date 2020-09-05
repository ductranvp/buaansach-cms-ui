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
        <el-table-column prop="userType" label="Loại tài khoản" width="160px">
          <template slot-scope="{row}">
            <el-tag size="mini">{{userTypes.find(item => item.value === row.userType).label}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="authorities" label="Nhóm Quyền" width="160px">
          <template slot-scope="{row}">
            <div v-for="role in row.authorities" :key="role">
              <el-tag size="mini">{{authorities.find(item => item.value === role).label}}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="activated" label="Kích hoạt">
          <template slot-scope="{row}">
            <el-button :disabled="currentUser.userLogin === row.userLogin" size="small" type="success"
                       @click="handleActivation(row)" v-if="row.userActivated">
              <span>Đã kích hoạt</span>
            </el-button>
            <el-button size="small" type="danger" @click="handleActivation(row)" v-else>
              <span>Đã khóa</span>
            </el-button>
          </template>
        </el-table-column>
        <template slot="action">
          <el-table-column width="130px" label="Thao tác">
            <template slot-scope="{ row }">
              <el-dropdown>
                <el-button size="mini"
                           type="warning"
                           :disabled="row.userLogin === 'anonymousUser' || row.userLogin === 'systembas'"
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
  import Authority from "@/enum/Authority";
  import UserType from "@/enum/UserType";

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
          userLogin: {label: 'Tên đăng nhập', display: true, sortable: true},
          fullName: {label: 'Họ Tên', display: true},
          userEmail: {label: 'Email', display: true},
          userPhone: {label: 'SĐT', display: true},
          createdBy: {label: 'Người tạo', display: false},
          createdDate: {label: 'Ngày tạo', display: false, type: 'time', sortable: true},
          lastModifiedBy: {label: 'Người sửa cuối', display: false},
          lastModifiedDate: {label: 'Ngày sửa cuối', display: false, type: 'time', sortable: true},
        },
        authorities: Authority.withLabel,
        userTypes: UserType.withLabel,
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
          await AdminUserService.toggleActivation(row.userLogin);
          row.userActivated = !row.userActivated;
        } catch (error) {
          NotificationUtils.error(error.message || error.data.message);
        }
      },
      handleChangePassword(row) {
        this.$prompt("Nhập vào mật khẩu mới cho '" + row.userLogin + "'", "Đổi mật khẩu", {
          confirmButtonText: this.$t("app.messageBox.okBtn"),
          cancelButtonText: this.$t("app.messageBox.cancelBtn"),
          inputValue: "",
          inputType: "password",
          dangerouslyUseHTMLString: false
        })
          .then(async cb => {
            if (cb.value && cb.value.length >= 4 && cb.value.length <= 100) {
              const payload = {
                userLogin: row.userLogin,
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

<style scoped>
</style>
