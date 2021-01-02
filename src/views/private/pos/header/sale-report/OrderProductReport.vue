<template>
  <el-container direction="vertical" v-loading="isLoading">
    <el-row class="padding-0-10">
      <el-alert :closable="false">
        <div class="text-large">
          <span>Kết quả thống kê từ </span>
          <span class="text-primary">{{
            form.startDate | moment("HH:mm - DD/MM/YYYY")
          }}</span>
          <span> đến </span>
          <span class="text-primary">{{
            form.endDate | moment("HH:mm - DD/MM/YYYY")
          }}</span>
          <span v-if="reportForUser">
            của
            <span class="text-primary">{{ reportForUser.fullName }}</span></span
          >
          <span> (Chỉ gồm những sản phẩm trên đơn đã thanh toán)</span>
        </div>
      </el-alert>
    </el-row>
    <el-row class="full-width padding-top-10">
      <el-col :span="12">
        <el-main class="padding-0-10">
          <raw-data-table :data="reportData">
            <el-table-column label="Tên sản phẩm" prop="product.productName" />
            <el-table-column label="Đã bán" prop="numberSold" />
            <el-table-column label="Đã hủy" prop="numberCancelled" />
            <el-table-column label="Đơn vị" prop="product.productUnit" />
          </raw-data-table>
        </el-main>
      </el-col>
      <el-col :span="12">
        <el-main class="padding-0-10">
          <raw-data-table :data="parsedReportData">
            <el-table-column label="Tên nguyên liệu" prop="ingredientName" />
            <el-table-column label="Số lượng" prop="productIngredientAmount" />
            <el-table-column label="Đơn vị" prop="ingredientUnit" />
          </raw-data-table>
        </el-main>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
import PosSaleReportService from "@/service/pos/pos.sale-report.service";
import ErrorUtils from "@/utils/error.util";
import AppUtils from "@/utils/app.util";
import RawDataTable from "@/components/raw-table-data/RawDataTable";
import AdminIngredientService from "@/service/admin/admin.ingredient.service";
import PosIngredientService from "@/service/pos/pos.ingredient.service";

export default {
  name: "OrderProductReport",
  components: { RawDataTable },
  data() {
    return {
      isLoading: false,
      form: {},
      listStoreUser: [],
      currentStoreUserRole: null,
      reportForUser: null,
      reportData: [],
      parsedReportData: [],
      ingredientsObject: {}
    };
  },
  methods: {
    async getReport(form, listStoreUser, currentStoreUserRole) {
      this.isLoading = true;
      this.reportData = [];
      this.parsedReportData = [];
      this.ingredientsObject = {};
      this.form = AppUtils.deepCopy(form);
      this.listStoreUser = AppUtils.deepCopy(listStoreUser);
      this.currentStoreUserRole = currentStoreUserRole;
      await this.getSaleReport();
      setTimeout(() => {
        this.isLoading = false;
      }, 300);
    },
    async getIngredients() {
      try {
        const {
          data: ingredients
        } = await PosIngredientService.getIngredients();
        ingredients.forEach(ele => {
          this.ingredientsObject[ele.guid] = ele;
        });
      } catch (error) {
        ErrorUtils.showErrorMessage(error);
      }
    },
    async parseReportData(data) {
      await this.getIngredients();
      const result = {};
      data.forEach(item => {
        item.listProductIngredient.forEach(productIngredient => {
          let temp = result[productIngredient.ingredientGuid];
          if (!temp) {
            temp = {
              ingredientGuid: productIngredient.ingredientGuid,
              productIngredientAmount:
                productIngredient.productIngredientAmount * item.numberSold
            };
          } else {
            temp.productIngredientAmount =
              temp.productIngredientAmount +
              productIngredient.productIngredientAmount * item.numberSold;
          }
          result[productIngredient.ingredientGuid] = temp;
        });
      });

      Object.keys(this.ingredientsObject).forEach(key => {
        if (result[key]) {
          this.parsedReportData.push({
            ...result[key],
            ...this.ingredientsObject[key]
          });
        }
      });
    },
    async getSaleReport() {
      if (this.form.userLogin) {
        this.reportForUser = this.listStoreUser.find(
          item => item.userLogin === this.form.userLogin
        );
      } else {
        this.reportForUser = null;
      }

      try {
        const { data } = await PosSaleReportService.getOrderProductReport(
          this.form
        );
        this.reportData = data;
        this.parseReportData(data);
      } catch (error) {
        ErrorUtils.showErrorMessage(
          error,
          "Lỗi tải thông tin thống kê, vui lòng thử lại sau!"
        );
      }
    }
  }
};
</script>

<style scoped></style>
