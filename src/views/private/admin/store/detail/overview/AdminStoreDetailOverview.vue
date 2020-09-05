<template>
  <el-container class="full-size" direction="horizontal">
    <el-row class="full-size" :gutter="10">
      <el-col :md="10" :sm="24">
        <div class="text-center">
          <el-image lazy class="store-image" :src="adminCurrentStore.storeImageUrl"
                    fit="cover" :preview-src-list="[adminCurrentStore.storeImageUrl]">
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
                  <td>{{adminCurrentStore.storeCode}}</td>
                </tr>
                <tr>
                  <td>Tên cửa hàng</td>
                  <td>{{adminCurrentStore.storeName}}</td>
                </tr>
                <tr>
                  <td>Địa chỉ</td>
                  <td>{{adminCurrentStore.storeAddress}}</td>
                </tr>
                <tr>
                  <td>Trạng thái</td>
                  <td>
                    <el-tag size="small" type="success" v-if="adminCurrentStore.storeStatus === 'OPENING'">
                      <span>Mở cửa</span>
                    </el-tag>
                    <el-tag size="small" type="danger" v-else>
                      <span>Đóng cửa</span>
                    </el-tag>
                  </td>
                </tr>
                <tr>
                  <td>Kích hoạt</td>
                  <td>
                    <el-tag size="small" type="success" v-if="adminCurrentStore.storeActivated">
                      <span>Bật</span>
                    </el-tag>
                    <el-tag size="small" type="danger" v-else>
                      <span>Tắt</span>
                    </el-tag>
                  </td>
                </tr>
                <tr>
                  <td>Chủ cửa hàng</td>
                  <td>{{adminCurrentStore.storeOwnerName}}</td>
                </tr>
                <tr>
                  <td>Số điện thoại</td>
                  <td>{{adminCurrentStore.storeOwnerPhone}}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{{adminCurrentStore.storeOwnerEmail}}</td>
                </tr>
                <tr>
                  <td>Mã số thuế</td>
                  <td>{{adminCurrentStore.storeTaxCode}}</td>
                </tr>
                <tr>
                  <td>Giờ hoạt động</td>
                  <td>{{adminCurrentStore.storeBusinessHours}}</td>
                </tr>
              </table>
              <el-divider class="margin-15-0"></el-divider>
              <el-row type="flex" class="full-width">
                <el-col :span="11">
                  <el-button class="full-width" type="warning" @click="handleEdit(adminCurrentStore)">
                    <span>{{ $t("common.entity.action.edit") }}</span>
                  </el-button>
                </el-col>
                <el-col :span="11" :offset="2">
                  <el-button class="full-width" type="danger" @click="handleDelete(adminCurrentStore)">
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
  import CreateOrUpdateStoreDialog from "@/views/private/admin/store/management/CreateOrUpdateStoreDialog";

  export default {
    name: "AdminStoreDetailOverview",
    components: {CreateOrUpdateStoreDialog},
    computed: {
      ...mapState({
        adminCurrentStore: state => state.adminStore.adminCurrentStore
      }),
    },
    methods: {
      async getStoreDetail() {
        if (this.$route.params.storeGuid) {
          try {
            const {data} = await AdminStoreService.getStore(this.$route.params.storeGuid);
            this.$store.commit("adminStore/SET_ADMIN_CURRENT_STORE", data);
          } catch (error) {
            NotificationUtils.error(error.message || error.data.message);
          }
        }
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
                await vm.$router.push({name: "adminStoreManagementPage"});
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
    width: 448px;
    height: 252px !important;
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
