<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    title="Nhập sản phẩm"
    :close-on-click-modal="false"
    :before-close="beforeClose"
    :destroy-on-close="true"
    :fullscreen="true"
  >
    <el-main>
      <el-row>
        <p>Chọn file CSV</p>
        <input id="csv" type="file">
      </el-row>
      <el-row class="padding-top-10">
        <raw-data-table :highlight-current-row="true" :data="csvData">
          <el-table-column v-for="key in headerRows" :key="key" :label="key" :prop="key">
            <template slot-scope="{row}">
              <el-input size="mini" v-model="row[key]"></el-input>
            </template>
          </el-table-column>
          <el-table-column v-if="headerRows.length" prop="categories" label="categories">
            <template slot-scope="{row}">
              <el-select size="mini" multiple v-model="row.categories" class="full-width">
                <el-option v-for="category in categories"
                           :key="category.guid"
                           :label="category.categoryName"
                           :value="category.guid">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column v-if="headerRows.length" prop="image" label="image">
            <template slot-scope="{row}">
              <input type="file" @change="changeProductImage($event, row)"/>
            </template>
          </el-table-column>
        </raw-data-table>
      </el-row>
    </el-main>
    <div slot="footer">
      <el-button @click="hide">
        <span>{{$t("common.entity.action.cancel")}}</span>
      </el-button>
      <el-button type="primary" @click="submit" :loading="isLoading">
        <span>{{$t("common.entity.action.save")}}</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import CsvUtils from "@/utils/csv.util";
  import RawDataTable from "@/components/raw-table-data/RawDataTable";
  import AdminCategoryService from "@/service/admin/admin.category.service";
  import AdminProductService from "@/service/admin/admin.product.service";
  import NotificationUtils from "@/utils/notification.util";

  export default {
    name: "ImportProductDialog",
    components: {RawDataTable},
    data() {
      return {
        isLoading: false,
        dialogFormVisible: false,
        headerRows: [],
        csvData: [],
        categories: [],
      };
    },
    methods: {
      resetData() {
        this.headerRows = [];
        this.csvData = [];
      },
      async show() {
        this.dialogFormVisible = true;
        const {data} = await AdminCategoryService.getAllCategory();
        this.categories = data;

        this.$nextTick(() => {
          let fileInput = document.getElementById("csv");
          fileInput.value = "";
          this.resetData();
          fileInput.addEventListener('change', this.changeFile);
        });
      },
      async changeFile() {
        const vm = this;
        let fileInput = document.getElementById("csv");
        let data = await CsvUtils.readFile(fileInput.files[0]);
        this.headerRows = CsvUtils.getHeaderRow(data);
        this.csvData = CsvUtils.parseCsvData(data);
        this.csvData = this.csvData.map(item => {
          this.$set(item, 'image', null);
          this.$set(item, 'categories', []);
          return item;
        });
      },
      changeProductImage(event, row) {
        row.image = {};
        row.image.raw = event.target.files[0];
      },
      hide() {
        this.dialogFormVisible = false;
      },
      beforeClose(done) {
        done();
      },
      async submit() {
        const vm = this;
        const validProducts = this.csvData.filter(item => {
          if (item.productName && item.productStatus && item.productType && item.productDisplay && item.productPrice && item.categories && item.categories.length){
            item.categories = vm.categories.filter(category => item.categories.includes(category.guid));
            return item;
          }
        });
        if (!validProducts.length) {
          this.hide();
          return;
        }
        try {
          this.isLoading = true;
          for (const product of validProducts) {
            await AdminProductService.createProduct(product, product.image);
          }
          this.$emit("hasChange", true);
          this.hide();
          this.isLoading = false;
          NotificationUtils.success("Nhập thành công");
        } catch (e) {
          this.isLoading = false;
          NotificationUtils.error("Đã có lỗi xảy ra");
        }
      },
    }
  };
</script>

<style scoped>

</style>
