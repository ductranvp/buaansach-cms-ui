<template>
  <el-container direction="vertical">
    <el-row :gutter="10">
      <el-col :span="10">
        <el-input v-model="searchKey" :placeholder="$t('common.entity.action.search')"
                  @keypress.enter.native="onSearch">
          <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button :loading="isLoading" @click="reloadTableData" icon="el-icon-refresh">
          <span>{{ $t("common.entity.action.refresh") }}</span>
        </el-button>
      </el-col>
      <el-col :span="10" class="text-right">
        <el-button type="primary" @click="createStore">
          <span>{{ $t("common.entity.action.create") }}</span>
        </el-button>
      </el-col>
    </el-row>
    <el-row class="margin-top-10">
      <data-table ref="storeTable" show-index :fetch-data="fetchData" :filter="filter" show-audit
                  :custom-audit="['createdBy', 'createdDate']">
        <template slot="expand">
          <el-table-column type="expand">
            <template slot-scope="{ row }">
              <admin-store-management-row-detail :row="row"/>
            </template>
          </el-table-column>
        </template>

        <el-table-column prop="storeCode" :label="$t('private.adminStoreManagementPage.store.storeCode')">
          <template slot-scope="{ row }">
            <router-link :to="{name: 'adminStoreDetailOverviewPage', params: {storeGuid: row.guid}}">
              <span>{{row.storeCode }}</span>
            </router-link>
          </template>
        </el-table-column>

        <el-table-column prop="storeName" sortable :label="$t('private.adminStoreManagementPage.store.storeName')">
        </el-table-column>

        <el-table-column prop="storeStatus" :label="$t('private.adminStoreManagementPage.store.storeStatus')">
          <template slot-scope="{ row }">
            <el-tag type="success" v-if="row.storeStatus === storeStatus.OPENING">
              <span>Mở cửa</span>
            </el-tag>
            <el-tag type="danger" v-else>
              <span>Đóng cửa</span>
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="storeActivated" :label="$t('private.adminStoreManagementPage.store.storeActivated')">
          <template slot-scope="{ row }">
            <el-tag type="success" v-if="row.storeActivated">
              <span>Bật</span>
            </el-tag>
            <el-tag type="danger" v-else>
              <span>Tắt</span>
            </el-tag>
          </template>
        </el-table-column>

        <template slot="action">
          <el-table-column :label="$t('common.entity.action.title')" width="180px">
            <template slot-scope="{ row }">
              <el-button size="mini" type="primary" plain @click="handleManage(row)">
                <span>{{ $t("common.entity.action.manage") }}</span>
                <i class="el-icon-top-right"></i>
              </el-button>
              <el-button size="mini" type="warning" plain @click="handleEdit(row)">
                <span>{{ $t("common.entity.action.edit") }}</span>
              </el-button>
            </template>
          </el-table-column>
        </template>
      </data-table>
    </el-row>
    <create-or-update-store-dialog ref="storeDialog" @storeSaved="reloadTableData"/>
  </el-container>
</template>

<script>
  import CreateOrUpdateStoreDialog from "@/views/private/admin/store/management/CreateOrUpdateStoreDialog";
  import AdminStoreService from "@/service/admin/admin.store.service";
  import DataTable from "@/components/data-table/DataTable";
  import AdminStoreManagementRowDetail from "@/views/private/admin/store/management/AdminStoreManagementRowDetail";
  import StoreStatus from "@/enum/StoreStatus";

  export default {
    name: "AdminStoreManagement",
    components: {AdminStoreManagementRowDetail, CreateOrUpdateStoreDialog, DataTable},
    data() {
      return {
        storeStatus: StoreStatus.values,
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
        vm.filter.searchKey = vm.searchKey;
        vm.isLoading = true;
        vm.$refs.storeTable.reload(whenDone);

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
        let routeData = this.$router.resolve({
          name: "adminStoreDetailOverviewPage",
          params: {storeGuid: row.guid}
        });
        window.open(routeData.href, "_blank");
      },
      handleEdit(row) {
        this.$refs["storeDialog"].edit(row);
      }
    }
  };
</script>

<style scoped></style>
