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
    <div class="padding-top-10">
      <el-row>
        <data-table :fetch-data="fetchData" :filter="filter" ref="storeTable">
          <el-table-column type="expand">
            <template slot-scope="{ row }">
              <row-detail @ownerChanged="reloadTableData" :row="row" />
            </template>
          </el-table-column>

          <el-table-column
            prop="storeCode"
            :label="$t('private.adminStoreListPage.storeEntity.storeCode')"
          >
            <template slot-scope="{ row }">
              <router-link
                :to="{
                  name: 'adminStoreDetailPage',
                  params: { storeGuid: row.guid }
                }"
              >
                {{ row.storeCode }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="storeName"
            sortable
            :label="$t('private.adminStoreListPage.storeEntity.storeName')"
          >
          </el-table-column>

          <el-table-column
            prop="storeOwnerName"
            :label="$t('private.adminStoreListPage.storeEntity.storeOwnerName')"
          >
          </el-table-column>

          <el-table-column
            prop="storeOwnerPhone"
            :label="$t('private.adminStoreListPage.storeEntity.storeOwnerPhone')"
          >
          </el-table-column>

          <el-table-column
            prop="storeStatus"
            :label="$t('private.adminStoreListPage.storeEntity.storeStatus')"
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

          <el-table-column
            prop="createdBy"
            :label="$t('private.adminStoreListPage.storeEntity.createdBy')"
          >
          </el-table-column>

          <el-table-column
            prop="createdDate"
            sortable
            :label="$t('private.adminStoreListPage.storeEntity.createdDate')"
          >
            <template slot-scope="{ row }">
              <span>{{ row.createdDate | moment("HH:mm - DD/MM/YYYY") }}</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('common.entity.action.title')"
            fixed="right"
            width="155px"
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
              <el-button
                size="mini"
                type="danger"
                plain
                @click="handleDelete(row)"
              >
                <span>{{ $t("common.entity.action.delete") }}</span>
              </el-button>
            </template>
          </el-table-column>
        </data-table>
      </el-row>
    </div>
    <create-or-update-store-dialog
      ref="storeDialog"
      @storeSaved="reloadTableData"
    />
  </el-container>
</template>

<script>
import CreateOrUpdateStoreDialog from "@/views/private/admin/management/store/components/CreateOrUpdateStoreDialog";
import StoreService from "@/service/store.service";
import DataTable from "@/components/data-table/index";
import MessageBoxUtils from "@/utils/message-box.util";
import NotificationUtils from "@/utils/notification.util";
import RowDetail from "@/views/private/admin/management/store/components/RowDetail";

export default {
  name: "AdminStoreList",
  components: { RowDetail, CreateOrUpdateStoreDialog, DataTable },
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
    // eslint-disable-next-line no-unused-vars
    reloadTableData(store) {
      const vm = this;
      vm.isLoading = true;
      this.$refs.storeTable.reload(whenDone);
      function whenDone() {
        vm.isLoading = false;
      }
    },
    onSearch() {
      /* change filterRequest property to trigger DataTable filter */
      this.filter.searchKey = this.searchKey;
    },
    fetchData(params) {
      return StoreService.getListStore(params);
    },
    handleEdit(row) {
      this.$refs["storeDialog"].edit(row);
    },
    handleDelete(row) {
      let vm = this;
      MessageBoxUtils.confirm(vm.$t("common.entity.delete.title"), function() {
        StoreService.deleteStore(row.guid)
          .then(() => {
            NotificationUtils.success(
              vm.$t("private.adminStoreListPage.notification.deleteSuccess")
            );
            vm.$refs.storeTable.reload();
          })
          .catch(error => {
            const message =
              error.message ||
              error.data.message ||
              vm.$t("private.adminStoreListPage.notification.deleteError");
            NotificationUtils.error(vm.$t(message));
          });
      });
    }
  }
};
</script>

<style scoped></style>
