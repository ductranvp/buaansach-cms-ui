<template>
  <el-container direction="vertical">
    <el-row type="flex" justify="end">
      <el-button type="info" @click="addStoreUser">
        <span>{{ $t("private.adminStoreDetailHumanPage.action.addExistedUser") }}</span>
      </el-button>
      <el-button type="primary" @click="createStoreUser">
        <span>{{ $t("common.entity.action.create") }}</span>
      </el-button>
    </el-row>
    <div class="margin-top-10">
      <raw-data-table ref="storeUserTable"
                      show-index
                      :data="storeUsers">
        <template slot="expand">
          <el-table-column type="expand">
            <template slot-scope="{row}">
              <admin-store-user-row-detail :row="row"/>
            </template>
          </el-table-column>
        </template>
        <el-table-column prop="userCode"
                         :label="$t('private.adminStoreDetailHumanPage.storeUser.userCode')">
        </el-table-column>
        <el-table-column prop="userLogin"
                         sortable
                         :label="$t('private.adminStoreDetailHumanPage.storeUser.userLogin')">
        </el-table-column>
        <el-table-column prop="fullName"
                         label="Họ tên">
        </el-table-column>
        <el-table-column prop="storeUserRole"
                         :label="$t('private.adminStoreDetailHumanPage.storeUser.storeUserRole')">
          <template slot-scope="{row}">
            <el-tag type="primary">
              {{storeUserRoleLabels[row.storeUserRole]}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="storeUserStatus"
                         :label="$t('private.adminStoreDetailHumanPage.storeUser.storeUserStatus')">
          <template slot-scope="{row}">
            <el-tag type="success" v-if="row.storeUserStatus === 'WORKING'">
              {{ $t("private.adminStoreDetailHumanPage.storeUserStatus.working") }}
            </el-tag>
            <el-tag type="warning" v-else-if="row.storeUserStatus === 'QUIT'">
              {{ $t("private.adminStoreDetailHumanPage.storeUserStatus.quit") }}
            </el-tag>
            <el-tag type="danger" v-else>
              {{ $t("private.adminStoreDetailHumanPage.storeUserStatus.fired") }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="storeUserActivated"
                         :label="$t('private.adminStoreDetailHumanPage.storeUser.activated')">
          <template slot-scope="{row}">
            <el-button :disabled="currentUser.userLogin === row.userLogin" size="small" type="success"
                       @click="handleActivated(row)" v-if="row.storeUserActivated">
              <span>Đã kích hoạt</span>
            </el-button>
            <el-button size="small" type="danger" @click="handleActivated(row)" v-else>
              <span>Đã khóa</span>
            </el-button>
          </template>
        </el-table-column>
        <template slot="action">
          <el-table-column
            :label="$t('common.entity.action.title')"
            width="100px"
          >
            <template slot-scope="{ row }">
              <el-button
                size="mini"
                type="warning"
                plain
                @click="handleEdit(row)"
              >
                <span>{{ $t("common.entity.action.edit") }}</span>
              </el-button>
            </template>
          </el-table-column>
        </template>
      </raw-data-table>
    </div>
    <add-store-user-dialog @addStoreUser="handleCreated" ref="addStoreUserDialog"/>
    <create-or-update-store-user-dialog @createStoreUser="handleCreated"
                                        @updateStoreUser="handleUpdated"
                                        ref="storeUserDialog"/>
  </el-container>
</template>

<script>
  import CreateOrUpdateStoreUserDialog from "@/views/private/admin/store/detail/user/CreateOrUpdateStoreUserDialog";
  import AdminStoreUserService from "@/service/admin/admin.store-user.service";
  import RawDataTable from "@/components/raw-table-data/RawDataTable";
  import AddStoreUserDialog from "@/views/private/admin/store/detail/user/AddStoreUserDialog";
  import AppUtils from "@/utils/app.util";
  import NotificationUtils from "@/utils/notification.util";
  import AdminStoreUserRowDetail from "@/views/private/admin/store/detail/user/AdminStoreUserRowDetail";
  import StoreUserRole from "@/enum/StoreUserRole";

  export default {
    name: "AdminStoreUser",
    components: {AdminStoreUserRowDetail, AddStoreUserDialog, RawDataTable, CreateOrUpdateStoreUserDialog},
    data() {
      return {
        storeUserRoleLabels: StoreUserRole.label,
        isLoading: false,
        searchKey: null,
        storeUsers: [],
      };
    },
    watch: {
      $route(to, from) {
        this.getStoreUser();
      },
    },
    created() {
      this.getStoreUser();
    },
    methods: {
      createStoreUser() {
        this.$refs.storeUserDialog.create();
      },
      addStoreUser() {
        this.$refs.addStoreUserDialog.add();
      },
      handleUpdated(data) {
        for (let i = 0; i < this.storeUsers.length; i++) {
          if (this.storeUsers[i].guid === data.guid) {
            AppUtils.setAttrs(this, this.storeUsers[i], data);
            break;
          }
        }
      },
      handleCreated(data) {
        this.storeUsers.push(data);
      },
      handleEdit(row) {
        this.$refs.storeUserDialog.edit(row);
      },
      async handleActivated(row) {
        try {
          await AdminStoreUserService.toggleActivation(row.guid);
          row.storeUserActivated = !row.storeUserActivated;
        } catch (error) {
          NotificationUtils.error(error.message || error.data.message);
        }
      },
      async getStoreUser() {
        const {data} = await AdminStoreUserService.getListStoreUserByStoreGuid(this.$route.params.storeGuid);
        this.storeUsers = data;
      }
    }
  };
</script>

<style scoped>

</style>
