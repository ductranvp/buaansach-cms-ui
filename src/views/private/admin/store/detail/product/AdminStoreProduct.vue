<template>
  <el-container class="full-size" direction="vertical">
    <el-row type="flex" align="middle" justify="end">
      <el-button :loading="isLoading" type="info" @click="addStoreProduct">
        <span>Thêm sản phẩm</span>
      </el-button>
      <el-button :loading="isLoading" type="primary" @click="addAllStoreProduct">
        <span>Cập nhật toàn bộ sản phẩm vào cửa hàng</span>
      </el-button>
    </el-row>
    <el-row class="margin-top-10">
      <raw-data-table ref="storeProductTable"
                      v-loading="isLoading"
                      show-index
                      :default-sort="{prop: 'productPosition', order: 'ascending'}"
                      :data="storeProducts">
        <template slot="expand">
          <el-table-column type="expand">
            <template slot-scope="{row}">
              <admin-store-product-row-detail :row="row"/>
            </template>
          </el-table-column>
        </template>
        <el-table-column prop="productCode" label="Mã SP" width="100px"></el-table-column>
        <el-table-column prop="productName" label="Tên sản phẩm">
          <template slot-scope="{row}">
            <span class="no-break-word">{{row.productName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="productPrice" label="Giá bán">
          <template slot-scope="{row}">
            <span>{{row.productPrice | priceAppend}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="storeProductStatus" label="Kho">
          <template slot-scope="{row}">

            <el-tag type="success" v-if="row.productStatus === 'AVAILABLE'">
              <span>Còn hàng</span>
            </el-tag>
            <el-tag type="warning" v-else-if="row.productStatus === 'UNAVAILABLE'">
              <span>Tạm hết hàng</span>
            </el-tag>
            <el-tag type="danger" v-else>
              <span>Ngừng kinh doanh</span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="storeProductStatus" label="Tại cửa hàng">
          <template slot-scope="{row}">
            <el-tag type="success" v-if="row.storeProductStatus === 'AVAILABLE'">
              <span>Còn hàng</span>
            </el-tag>
            <el-tag type="warning" v-else-if="row.storeProductStatus === 'UNAVAILABLE'">
              <span>Tạm hết hàng</span>
            </el-tag>
            <el-tag type="danger" v-else>
              <span>Ngừng kinh doanh</span>
            </el-tag>
          </template>
        </el-table-column>
        <!--        <el-table-column prop="productPosition" sortable label="Thứ tự"></el-table-column>-->
        <template slot="action">
          <el-table-column label="Thao tác" width="160px">
            <template slot-scope="{row}">
              <el-button size="mini" type="warning" plain @click="handleEdit(row)">
                <span>{{ $t("common.entity.action.edit") }}</span>
              </el-button>
              <el-button size="mini" type="danger" plain @click="handleDelete(row)">
                <span>{{ $t("common.entity.action.delete") }}</span>
              </el-button>
            </template>
          </el-table-column>
        </template>
      </raw-data-table>
    </el-row>
    <add-or-update-store-product-dialog @onUpdated="onUpdated" @onCreated="onCreated" ref="storeProductDialog"/>
  </el-container>
</template>

<script>
  import NotificationUtils from "@/utils/notification.util";
  import AdminStoreProductService from "@/service/admin/admin.store-product.service";
  import RawDataTable from "@/components/raw-table-data/RawDataTable";
  import MessageBoxUtils from "@/utils/message-box.util";
  import AddOrUpdateStoreProductDialog from "@/views/private/admin/store/detail/product/AddOrUpdateStoreProductDialog";
  import AppUtils from "@/utils/app.util";
  import AdminStoreProductRowDetail from "@/views/private/admin/store/detail/product/AdminStoreProductRowDetail";

  export default {
    name: "AdminStoreProduct",
    components: {AdminStoreProductRowDetail, AddOrUpdateStoreProductDialog, RawDataTable},
    data() {
      return {
        isLoading: false,
        storeProducts: []
      };
    },
    created() {
      if (this.$route.params.storeGuid) {
        this.getStoreProducts();
      }
    },
    methods: {
      onUpdated(storeProduct) {
        for (let i = 0; i < this.storeProducts.length; i++) {
          if (this.storeProducts[i].guid === storeProduct.guid) {
            AppUtils.setAttrs(this, this.storeProducts[i], storeProduct);
            break;
          }
        }
      },
      onCreated(storeProduct) {
        this.storeProducts.push(storeProduct);
      },
      async getStoreProducts() {
        try {
          const {data} = await AdminStoreProductService.getListStoreProductByStoreGuid(this.$route.params.storeGuid);
          this.storeProducts = data;
        } catch (error) {
          NotificationUtils.error(error.message || error.data.message);
        }
      },
      addStoreProduct() {
        this.$refs.storeProductDialog.add();
      },
      addAllStoreProduct() {
        const vm = this;
        MessageBoxUtils.confirm("Cập nhật tất cả sản phẩm hiện có vào cửa hàng?", async function () {
          try {
            vm.isLoading = true;
            const {data} = await AdminStoreProductService.addAllStoreProduct(vm.$route.params.storeGuid);
            vm.storeProducts = data;
            NotificationUtils.success(vm.$t("common.entity.save.success"));
            vm.isLoading = false;
          } catch (error) {
            vm.isLoading = false;
            NotificationUtils.error(error.message || error.data.message);
          }
        });
      },
      handleEdit(storeProduct) {
        this.$refs.storeProductDialog.edit(storeProduct);
      },
      handleDelete(storeProduct) {
        const vm = this;
        MessageBoxUtils.confirm("Xóa sản phẩm này khỏi cửa hàng?", async function () {
          try {
            await AdminStoreProductService.deleteStoreProduct(storeProduct.guid);
            vm.storeProducts = vm.storeProducts.filter(sp => sp.guid !== storeProduct.guid);
            NotificationUtils.success(vm.$t("common.entity.delete.success"));
          } catch (error) {
            NotificationUtils.error(error.message || error.data.message);
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
