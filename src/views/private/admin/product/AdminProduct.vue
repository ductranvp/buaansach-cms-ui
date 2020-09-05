<template>
  <el-container class="full-size" direction="vertical">
    <sort-product-dialog @hasChange="hasChange" ref="sortProductDialog" />
    <import-product-dialog @hasChange="hasChange" ref="importProductDialog" />
    <create-or-update-product-dialog @saved="reloadTableData" ref="productDialog"/>
    <div>
      <el-row :gutter="10">
        <el-col :span="10">
          <el-input
            placeholder="Tìm theo mã hoặc tên sản phẩm"
            v-model="searchKey"
            @keyup.enter.native="onSearch"
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
            <el-button type="primary" @click="showImportDialog">
              <span>Nhập từ file CSV</span>
            </el-button>
            <el-button type="primary" @click="showSortDialog">
              <span>Sắp xếp</span>
            </el-button>
            <el-button type="primary" @click="createProduct">
              <span>{{ $t("common.entity.action.create") }}</span>
            </el-button>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="margin-top-10">
      <data-table
        ref="productTable"
        show-index
        :fetch-data="fetchData"
        :default-sort="{prop: 'productPosition', order: 'ascending'}"
        :filter="filter"
      >
        <template slot="expand">
          <el-table-column type="expand">
            <template slot-scope="{row}">
              <admin-product-row-detail :row="row" />
            </template>
          </el-table-column>
        </template>

        <el-table-column prop="productThumbnailUrl" label="Hình" width="72px">
          <template slot-scope="{row}">
            <el-image class="product-thumbnail" :src="row.productThumbnailUrl" :preview-src-list="[row.productThumbnailUrl]">
              <div slot="error" class="image-error-slot full-size">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>

        <el-table-column prop="productCode" label="Mã SP"></el-table-column>

        <el-table-column prop="productName" label="Tên sản phẩm">
          <template slot-scope="{row}">
            <span class="no-break-word">{{row.productName}}</span>
            <el-divider class="margin-0"></el-divider>
            <span class="no-break-word">{{row.productNameEng}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="productPrice" label="Giá bán">
          <template slot-scope="{row}">
            <span class="no-break-word">{{row.productPrice | priceAppend}}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="100px" prop="productStatus" label="Trạng thái">
          <template slot-scope="{row}">
            <el-tag v-if="row.productStatus === 'AVAILABLE'" type="success">Còn hàng</el-tag>
            <el-tag v-else-if="row.productStatus === 'UNAVAILABLE'" type="warning">Tạm hết hàng</el-tag>
            <el-tag v-else type="danger">Ngừng kinh doanh</el-tag>
          </template>
        </el-table-column>

<!--        <el-table-column min-width="100px" prop="productType" label="Loại sản phẩm">-->
<!--          <template slot-scope="{row}">-->
<!--            <el-tag v-if="row.productType === 'MAIN_PRODUCT'" type="primary">Sản phẩm chính</el-tag>-->
<!--            <el-tag v-else type="primary">Sản phẩm phụ</el-tag>-->
<!--          </template>-->
<!--        </el-table-column>-->

        <el-table-column min-width="100px" prop="productActivated" label="Kích hoạt">
          <template slot-scope="{row}">
            <el-tag v-if="row.productActivated" type="success">Bật</el-tag>
            <el-tag v-else type="danger">Tắt</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Danh mục">
          <template slot-scope="{row}">
            <el-tag v-for="category in row.categories" :key="category.guid">{{category.categoryName}}</el-tag>
          </template>
        </el-table-column>

        <template slot="action">
          <el-table-column
            :label="$t('common.entity.action.title')"
            width="155px"
          >
            <template slot-scope="{ row }">
              <el-button
                size="mini"
                type="warning"
                plain
                @click="editProduct(row)"
              >
                <span>{{ $t("common.entity.action.edit") }}</span>
              </el-button>
              <el-button
                size="mini"
                type="danger"
                plain
                @click="deleteProduct(row)"
              >
                <span>{{ $t("common.entity.action.delete") }}</span>
              </el-button>
            </template>
          </el-table-column>
        </template>
      </data-table>
    </div>
  </el-container>
</template>

<script>
  import DataTable from "@/components/data-table/DataTable";
  import AdminProductService from "@/service/admin/admin.product.service";
  import CreateOrUpdateProductDialog from "@/views/private/admin/product/CreateOrUpdateProductDialog";
  import MessageBoxUtils from "@/utils/message-box.util";
  import NotificationUtils from "@/utils/notification.util";
  import AdminCategoryService from "@/service/admin/admin.category.service";
  import AppUtils from "@/utils/app.util";
  import SortProductDialog from "@/views/private/admin/product/SortProductDialog";
  import ImportProductDialog from "@/views/private/admin/product/ImportProductDialog";
  import AdminProductRowDetail from "@/views/private/admin/product/AdminProductRowDetail";

  export default {
    name: "AdminProductManagement",
    components: {AdminProductRowDetail, ImportProductDialog, SortProductDialog, CreateOrUpdateProductDialog, DataTable},
    data() {
      return {
        isLoading: false,
        searchKey: "",
        filter: {
          searchKey: "",
        },
        categories: {}
      };
    },
    created() {
      this.getCategory();
    },
    methods: {
      async getCategory() {
        const vm = this;
        try {
          const {data} = await AdminCategoryService.getAllCategory();
          let temp = {};
          for (let i = 0; i < data.length; i++) {
            temp[data[i].guid] = data[i].categoryName;
          }
          AppUtils.setAttrs(vm, vm.categories, temp);
        } catch (error) {
          NotificationUtils.error(error.message || error.data.message);
        }
      },
      hasChange(value){
        if (value){
          this.reloadTableData();
        }
      },
      onSearch() {
        this.filter.searchKey = this.searchKey;
      },
      reloadTableData() {
        const vm = this;
        vm.filter.searchKey = vm.searchKey;
        vm.isLoading = true;
        vm.$refs.productTable.reload(whenDone);

        function whenDone() {
          vm.isLoading = false;
        }
      },
      fetchData(params) {
        return AdminProductService.getListProduct(params);
      },
      createProduct() {
        this.$refs.productDialog.create();
      },
      editProduct(product) {
        this.$refs.productDialog.edit(product);
      },
      deleteProduct(product) {
        const vm = this;
        MessageBoxUtils.confirm(this.$t("common.entity.delete.title"), async function () {
          try {
            await AdminProductService.deleteProduct(product.guid);
            vm.reloadTableData();
          } catch (error) {
            NotificationUtils.error(error.message || error.data.message);
          }
        });
      },
      showSortDialog(){
        this.$refs.sortProductDialog.show();
      },
      showImportDialog(){
        this.$refs.importProductDialog.show();
      }
    }
  };
</script>

<style scoped>
  .product-thumbnail {
    height: 50px;
    width: 50px;
    object-fit: cover;
  }
</style>
