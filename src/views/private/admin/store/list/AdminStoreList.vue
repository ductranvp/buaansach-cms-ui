<template>
  <el-container direction="vertical">
    <div>
      <el-row :gutter="10">
        <el-col :span="10">
          <el-input
            :placeholder="$t('private.adminStoreListPage.searchPlaceholder')"
            v-model="searchKey"
            @keypress.enter.native="onSearch"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="onSearch"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            :loading="isLoading"
            @click="reloadTableData"
            icon="el-icon-refresh"
          >
            <span>{{ $t("common.entity.action.refresh") }}</span>
          </el-button>
        </el-col>
        <el-col :span="10">
          <el-row type="flex" justify="end">
            <el-button type="primary" @click="createStore">
              <span>{{ $t("common.entity.action.create") }}</span>
            </el-button>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="margin-top-10">
      <data-table :fetch-data="fetchData"
                  :filter="filter"
                  ref="storeTable"
                  show-audit
                  :custom-audit="['createdBy', 'createdDate']">
        <el-table-column type="expand">
          <template slot-scope="{ row }">
            <admin-store-list-row-detail :row="row"/>
          </template>
        </el-table-column>

        <el-table-column
          prop="storeCode"
          :label="$t('private.adminStoreListPage.store.storeCode')"
        >
          <template slot-scope="{ row }">
            <el-link href="javascript:void(0)" @click.native="handleManage(row)">
              {{ row.storeCode }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column
          prop="storeName"
          sortable
          :label="$t('private.adminStoreListPage.store.storeName')"
        >
        </el-table-column>

        <el-table-column
          prop="storeOwnerName"
          :label="$t('private.adminStoreListPage.store.storeOwnerName')"
        >
        </el-table-column>

        <el-table-column
          prop="storeOwnerPhone"
          :label="$t('private.adminStoreListPage.store.storeOwnerPhone')"
        >
        </el-table-column>

        <el-table-column
          prop="storeStatus"
          :label="$t('private.adminStoreListPage.store.storeStatus')"
        >
          <template slot-scope="{ row }">
            <el-tag type="success" v-if="row.storeStatus === 'ACTIVATED'">
              {{ $t("private.adminStoreListPage.storeStatus.activated") }}
            </el-tag>
            <el-tag type="warning" v-else-if="row.storeStatus === 'PAUSED'">
              {{ $t("private.adminStoreListPage.storeStatus.paused") }}
            </el-tag>
            <el-tag type="danger" v-else>
              {{ $t("private.adminStoreListPage.storeStatus.deactivated") }}
            </el-tag>
          </template>
        </el-table-column>

        <template slot="action">
          <el-table-column
            :label="$t('common.entity.action.title')"
            width="160px"
          >
            <template slot-scope="{ row }">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="handleManage(row)"
              >
                <span>{{ $t("common.entity.action.manage") }}</span>
              </el-button>
              <el-button
                size="mini"
                type="warning"
                plain
                @click="handleEdit(row)"
              >
                <span>{{ $t("common.entity.action.edit") }}</span>
              </el-button>
<!--              <el-button-->
<!--                size="mini"-->
<!--                type="danger"-->
<!--                plain-->
<!--                @click="handleDelete(row)"-->
<!--              >-->
<!--                <span>{{ $t("common.entity.action.delete") }}</span>-->
<!--              </el-button>-->
            </template>
          </el-table-column>
        </template>
      </data-table>
    </div>
    <create-or-update-store-dialog
      ref="storeDialog"
      @storeSaved="reloadTableData"
    />
  </el-container>
</template>

<script>
  import CreateOrUpdateStoreDialog from "@/views/private/admin/store/list/CreateOrUpdateStoreDialog";
  import AdminStoreService from "@/service/admin/admin.store.service";
  import DataTable from "@/components/data-table/DataTable";
  import MessageBoxUtils from "@/utils/message-box.util";
  import NotificationUtils from "@/utils/notification.util";
  import AdminStoreListRowDetail from "@/views/private/admin/store/list/AdminStoreListRowDetail";

  export default {
    name: "AdminStoreList",
    components: {AdminStoreListRowDetail, CreateOrUpdateStoreDialog, DataTable},
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
      createStore() {
        this.$refs.storeDialog.create();
      },
      reloadTableData() {
        const vm = this;
        vm.isLoading = true;
        this.$refs.storeTable.reload(whenDone);

        function whenDone() {
          vm.isLoading = false;
        }
      },
      onSearch() {
        /* change filter property to trigger DataTable filter */
        this.filter.searchKey = this.searchKey;
      },
      fetchData(params) {
        return AdminStoreService.getListStore(params);
      },
      handleManage(row) {
        let routeData = this.$router.resolve({name: 'adminStoreDetailOverviewPage', params: {storeGuid: row.guid}});
        window.open(routeData.href, '_blank');
      },
      handleEdit(row) {
        this.$refs["storeDialog"].edit(row);
      },
      handleDelete(row) {
        let vm = this;
        MessageBoxUtils.confirm(vm.$t("common.entity.delete.title"), async function () {
          try {
            await AdminStoreService.deleteStore(row.guid);
            NotificationUtils.success(vm.$t("common.entity.delete.success"));
            vm.$refs.storeTable.reload();
          } catch (error) {
            NotificationUtils.error(error.message || error.data.message);
          }
        });
      }
    }
  };
</script>

<style scoped></style>
