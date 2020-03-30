<template>
  <el-container direction="vertical">
    <div>
      <el-row :gutter="10">
        <el-col :span="10">
          <el-input
            :placeholder="$t('private.adminStorePage.searchPlaceholder')"
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
        <el-col :span="14">
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
              <el-row type="flex" align="middle">
                <el-col :span="5" :xs="24">
                  <el-image
                    style="width: 208px; height:117px"
                    :src="row.imageUrl"
                    fit="cover"
                    :preview-src-list="[row.imageUrl]"
                  >
                    <div slot="error" class="image-error-slot full-size">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                </el-col>
                <el-col :span="15" :xs="24">
                  <el-row type="flex">
                    <el-col :span="10">
                      <table class="expanded-table">
                        <tr>
                          <td>
                            {{
                              $t(
                                "private.adminStorePage.storeEntity.ownerEmail"
                              )
                            }}
                          </td>
                          <td>{{ row.ownerEmail }}</td>
                        </tr>
                        <tr>
                          <td>
                            {{
                              $t("private.adminStorePage.storeEntity.taxCode")
                            }}
                          </td>
                          <td>{{ row.taxCode }}</td>
                        </tr>
                        <tr>
                          <td>
                            {{
                              $t(
                                "private.adminStorePage.storeEntity.numberOfFloors"
                              )
                            }}
                          </td>
                          <td>{{ row.numberOfFloors }}</td>
                        </tr>
                        <tr>
                          <td>
                            {{
                              $t(
                                "private.adminStorePage.storeEntity.numberOfSeats"
                              )
                            }}
                          </td>
                          <td>{{ row.numberOfSeats }}</td>
                        </tr>
                      </table>
                    </el-col>
                    <el-col :span="1">
                      <el-divider
                        direction="vertical"
                        class="full-height"
                      ></el-divider>
                    </el-col>
                    <el-col :span="13">
                      <table class="expanded-table">
                        <tr>
                          <td>
                            {{
                              $t("private.adminStorePage.storeEntity.address")
                            }}
                          </td>
                          <td>{{ row.address }}</td>
                        </tr>
                        <tr>
                          <td>
                            {{
                              $t(
                                "private.adminStorePage.storeEntity.previousUpdateReason"
                              )
                            }}
                          </td>
                          <td>{{ row.updateReason }}</td>
                        </tr>
                        <tr>
                          <td>
                            {{
                              $t(
                                "private.adminStorePage.storeEntity.lastModifiedDate"
                              )
                            }}
                          </td>
                          <td>
                            {{
                              row.lastModifiedDate
                                | moment("HH:mm - DD/MM/YYYY")
                            }}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            {{
                              $t(
                                "private.adminStorePage.storeEntity.lastModifiedBy"
                              )
                            }}
                          </td>
                          <td>{{ row.lastModifiedBy }}</td>
                        </tr>
                      </table>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>

          <el-table-column
            prop="code"
            :label="$t('private.adminStorePage.storeEntity.code')"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            sortable
            :label="$t('private.adminStorePage.storeEntity.name')"
          >
          </el-table-column>

          <el-table-column
            prop="ownerName"
            :label="$t('private.adminStorePage.storeEntity.ownerName')"
          >
          </el-table-column>

          <el-table-column
            prop="ownerPhone"
            :label="$t('private.adminStorePage.storeEntity.ownerPhone')"
          >
          </el-table-column>

          <el-table-column
            prop="status"
            :label="$t('private.adminStorePage.storeEntity.status')"
          >
            <template slot-scope="{ row }">
              <el-tag type="success" v-if="row.status === 'ACTIVATED'">
                {{ $t("private.adminStorePage.storeStatus.activated") }}
              </el-tag>
              <el-tag type="warning" v-else-if="row.status === 'PAUSED'">
                {{ $t("private.adminStorePage.storeStatus.paused") }}
              </el-tag>
              <el-tag type="danger" v-else>
                {{ $t("private.adminStorePage.storeStatus.deactivated") }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            prop="createdBy"
            :label="$t('private.adminStorePage.storeEntity.createdBy')"
          >
          </el-table-column>

          <el-table-column
            prop="createdDate"
            sortable
            :label="$t('private.adminStorePage.storeEntity.createdDate')"
          >
            <template slot-scope="{ row }">
              <span>{{ row.createdDate | moment("HH:mm - DD/MM/YYYY") }}</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('common.entity.action.title')"
            fixed="right"
            width="150px"
          >
            <template slot-scope="{ row }">
              <el-button size="mini" @click="handleEdit(row)">
                <span>{{ $t("common.entity.action.edit") }}</span>
              </el-button>
              <el-button size="mini" type="danger" @click="handleDelete(row)">
                <span>{{ $t("common.entity.action.delete") }}</span>
              </el-button>
            </template>
          </el-table-column>
        </data-table>
      </el-row>
    </div>
    <admin-store-dialog ref="storeDialog" @storeSaved="onStoreSaved" />
  </el-container>
</template>

<script>
import AdminStoreDialog from "@/views/private/admin/management/store/dialog/AdminStoreDialog";
import StoreService from "@/service/store.service";
import DataTable from "@/components/data-table/index";
import MessageBoxUtils from "@/utils/message-box.util";
import NotificationUtils from "@/utils/notification.util";

export default {
  name: "AdminStoreManagement",
  components: { AdminStoreDialog, DataTable },
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
    onStoreSaved(store) {
      this.$refs.storeTable.reload();
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
        StoreService.deleteStore(row.code)
          .then(() => {
            NotificationUtils.success(
              vm.$t("private.adminStorePage.notification.deleteSuccess")
            );
            vm.$refs.storeTable.reload();
          })
          .catch(error => {
            const message =
              error.message ||
              error.data.message ||
              vm.$t("private.adminStorePage.notification.deleteError");
            NotificationUtils.error(vm.$t(message));
          });
      });
    }
  }
};
</script>

<style scoped>
.expanded-table {
  width: 100%;
}
.expanded-table tr td {
  border: none;
  /*padding: 0px 0px 5px 0px;*/
}
</style>
