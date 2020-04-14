<template>
  <el-container class="full-size" direction="horizontal">
    <el-row class="full-size" :gutter="10">
      <el-col :md="10" :sm="24">
        <div class="text-center">
          <el-image
            v-if="currentStore.storeImageUrl"
            class="store-image"
            :src="currentStore.storeImageUrl"
            fit="cover"
            :preview-src-list="[currentStore.storeImageUrl]"
          >
            <div slot="error" class="image-error-slot full-size">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <el-image
            v-else
            class="store-image-error"
            fit="cover"
          >
            <div slot="error" class="image-error-slot full-size">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </div>
      </el-col>
      <el-col :md="14" :sm="24">
        <div>
          <el-card shadow="never" class="full-size">

            <div>
              <table>
                <tr>
                  <td>Mã cửa hàng</td>
                  <td>{{currentStore.storeCode}}</td>
                </tr>
                <tr>
                  <td>Tên cửa hàng</td>
                  <td>{{currentStore.storeName}}</td>
                </tr>
                <tr>
                  <td>Địa chỉ</td>
                  <td>{{currentStore.storeAddress}}</td>
                </tr>
                <tr>
                  <td>Trạng thái</td>
                  <td>
                    <el-tag
                      size="small"
                      type="success"
                      effect="dark"
                      v-if="currentStore.storeStatus === 'ACTIVATED'"
                    >{{ $t("private.adminStoreListPage.storeStatus.activated") }}
                    </el-tag>
                    <el-tag
                      size="small"
                      type="warning"
                      effect="dark"
                      v-else-if="currentStore.storeStatus === 'PAUSED'"
                    >{{ $t("private.adminStoreListPage.storeStatus.paused") }}
                    </el-tag>
                    <el-tag
                      size="small"
                      type="danger"
                      effect="dark"
                      v-else
                    >{{ $t("private.adminStoreListPage.storeStatus.deactivated") }}
                    </el-tag>
                  </td>
                </tr>
                <tr>
                  <td>Chủ cửa hàng</td>
                  <td>{{currentStore.storeOwnerName}}</td>
                </tr>
                <tr>
                  <td>Số điện thoại</td>
                  <td>{{currentStore.storeOwnerPhone}}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{{currentStore.storeOwnerEmail}}</td>
                </tr>
                <tr>
                  <td>Mã số thuế</td>
                  <td>{{currentStore.storeTaxCode}}</td>
                </tr>
                <tr>
                  <td>Giờ hoạt động</td>
                  <td><span v-if="currentStore.storeOpenHour">{{currentStore.storeOpenHour}} - {{currentStore.storeCloseHour}}</span>
                  </td>
                </tr>
              </table>
              <el-divider class="margin-15-0"></el-divider>
              <el-row type="flex" class="full-width">
                <el-col :span="11">
                  <el-button class="full-width" type="warning" @click="handleEdit(currentStore)">
                    <span>{{ $t("common.entity.action.edit") }}</span>
                  </el-button>
                </el-col>
                <el-col :span="11" :offset="2">
                  <el-button class="full-width" type="danger" @click="handleDelete(currentStore)">
                    <span>{{ $t("common.entity.action.delete") }}</span>
                  </el-button>
                </el-col>
              </el-row>
            </div>

          </el-card>
        </div>
      </el-col>
    </el-row>
    <create-or-update-store-dialog ref="storeDialog" @storeSaved="getStoreDetail"/>
  </el-container>
</template>

<script>
  import {mapState} from "vuex";
  import MessageBoxUtils from "@/utils/message-box.util";
  import AdminStoreService from "@/service/admin/admin.store.service";
  import NotificationUtils from "@/utils/notification.util";
  import CreateOrUpdateStoreDialog from "@/views/private/admin/store/list/CreateOrUpdateStoreDialog";

  export default {
    name: "AdminStoreDetailOverview",
    components: {CreateOrUpdateStoreDialog},
    computed: {
      ...mapState({
        currentStore: state => state.adminStore.currentStore
      }),
    },
    methods: {
      async getStoreDetail() {
        const {data} = await AdminStoreService.getStore(this.$route.params.storeGuid);
        this.$store.commit("adminStore/SET_CURRENT_STORE", data);
      },
      handleEdit(row) {
        this.$refs["storeDialog"].edit(row);
      },
      handleDelete(row) {
        if (!row.guid) return;
        let vm = this;
        const template = "<b style='color: darkred'>Chú ý: Mọi dữ liệu liên quan tới cửa hàng sẽ bị xóa!</b>" +
          "<br>Nhập vào chữ <b style='color: darkred'>ok</b> để thực hiện.";
        MessageBoxUtils.prompt("Xác nhận", template, true, "",
          async function (cb) {
            if (cb.value.toLowerCase() === 'ok') {
              try {
                await AdminStoreService.deleteStore(row.guid);
                NotificationUtils.success(vm.$t("common.entity.delete.success"));
                await vm.$router.push({name: "adminStoreListPage"});
              } catch (error) {
                NotificationUtils.error(error.message || error.data.message);
              }
            } else {
              NotificationUtils.error("Xóa không thành công");
            }
          });
      }
    }
  }
  ;
</script>

<style scoped>
  .store-image-error {
    min-width: 100%;
    height: 180px;
    min-height: 180px !important;
    border: 2px solid gray;
    box-sizing: border-box;
    border-radius: 5px;
  }

  .store-image {
    min-width: 320px;
    min-height: 180px !important;
    border: 2px solid gray;
    box-sizing: border-box;
    border-radius: 5px;
  }

  table, td, th {
    /*border: 1px solid #ddd;*/
    text-align: left;
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  th, td {
    height: 40px;
    padding: 0 10px;
  }

  td:nth-child(odd) {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  td:nth-child(even) {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  tr:nth-child(odd) {
    background-color: #f5f5f5;
  }

  /deep/ .el-card__body {
    padding: 10px !important;
  }
</style>
