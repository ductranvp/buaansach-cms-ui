<template>
  <el-container>
    <el-main class="padding-0-10">
      <el-row class="padding-bottom-10">
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
              <span class="text-primary">{{
                reportForUser.fullName
              }}</span></span
            >
          </div>
        </el-alert>
      </el-row>
      <raw-data-table :data="reportData">
        <el-table-column label="Tên sản phẩm" prop="product.productName" />
        <el-table-column label="Đã bán" prop="numberSold" />
        <el-table-column label="Đã hủy" prop="numberCancelled" />
        <el-table-column label="Đơn vị" prop="product.productUnit" />
      </raw-data-table>
    </el-main>
  </el-container>
</template>

<script>
import PosSaleReportService from "@/service/pos/pos.sale-report.service";
import ErrorUtils from "@/utils/error.util";
import AppUtils from "@/utils/app.util";
import RawDataTable from "@/components/raw-table-data/RawDataTable";

export default {
  name: "OrderProductReport",
  components: { RawDataTable },
  data() {
    return {
      form: {},
      listStoreUser: [],
      currentStoreUserRole: null,
      reportForUser: null,
      reportData: []
    };
  },
  methods: {
    getReport(form, listStoreUser, currentStoreUserRole) {
      this.form = AppUtils.deepCopy(form);
      this.listStoreUser = AppUtils.deepCopy(listStoreUser);
      this.currentStoreUserRole = currentStoreUserRole;
      this.getSaleReport();
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
