<template>
  <el-container class="full-size" direction="vertical">
    <div>
      <el-row :gutter="10">
        <el-col :span="10">
          <el-input
            placeholder="Tìm theo mã hoặc tên sản phẩm"
            v-model="searchKey"
            @key.enter="onSearch"
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
        :fetch-data="fetchData"
        show-audit
        :custom-audit="['createdBy', 'createdDate']"
        :filter="filter"
      >
        <el-table-column prop="productCode" label="Mã SP"></el-table-column>

        <el-table-column prop="productName" label="Tên sản phẩm"></el-table-column>

        <el-table-column min-width="100px" prop="productStatus" label="Trạng thái">
          <template slot-scope="{row}">
            <el-tag v-if="row.productStatus === 'AVAILABLE'" type="success">Còn hàng</el-tag>
            <el-tag v-else-if="row.productStatus === 'UNAVAILABLE'" type="warning">Tạm hết hàng</el-tag>
            <el-tag v-else type="danger">Ngừng kinh doanh</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="productRootPrice" label="Giá gốc"></el-table-column>
        <el-table-column prop="productNormalPrice" label="Giá bán"></el-table-column>
        <el-table-column prop="productSalePrice" label="Giá khuyến mãi"></el-table-column>
        <el-table-column prop="categoryName" label="Danh mục">
          <template slot-scope="{row}">
            <span>{{categories[row.categoryGuid]}}</span>
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
    <create-or-update-product-dialog @productSaved="reloadTableData" ref="productDialog"/>
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

  export default {
    name: "AdminProductManagement",
    components: {CreateOrUpdateProductDialog, DataTable},
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
      onSearch() {
        this.filter.searchKey = this.searchKey;
      },
      reloadTableData() {
        this.isLoading = true;
        this.$refs.productTable.reload(whenDone);
        const vm = this;

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
            NotificationUtils.success(vm.$t("common.entity.delete.success"));
          } catch (error) {
            NotificationUtils.error(error.message || error.data.message);
          }
        });
      }
    }
  };
</script>

<style scoped></style>
