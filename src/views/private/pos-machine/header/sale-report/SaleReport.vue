<template>
  <el-container class="full-size" direction="vertical">
    <el-header class="bg-success  padding-0-10" height="50px">
      <el-row class="full-size" type="flex" align="middle">
        <el-button size="small" type="success" @click="goBack">
          <i class="el-icon-arrow-left"></i>
          <span>Trở lại</span>
        </el-button>
        <el-col>
          <el-row justify="end" type="flex" align="middle">
            <div class="padding-right-10">
              <el-select placeholder="Chọn nhân viên" size="small" v-model="form.userLogin"
                         v-if="['STORE_MANAGER', 'STORE_OWNER'].includes(this.currentStoreUserRole)">
                <el-option label="Tất cả" value=""></el-option>
                <el-option v-for="u in listStoreUser"
                           :key="u.userLogin"
                           :label="u.userLogin"
                           :value="u.userLogin"></el-option>
              </el-select>
            </div>
            <div class="padding-right-10">
              <el-date-picker
                :format="dateFormat"
                v-model="dateRange"
                size="small"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="-"
                start-placeholder="Ngày bắt đầu"
                end-placeholder="Ngày kết thúc"
                align="right">
              </el-date-picker>
            </div>
            <div>
              <el-button @click="handleGetReport" type="warning" size="small">Xem thống kê</el-button>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </el-header>
    <el-main v-loading="isLoading" class="full-size padding-10">
      <div v-if="!isLoading">
        <el-row class="padding-bottom-10">
          <el-alert :closable="false">
            <div class="text-large">
              <span>Kết quả thống kê từ </span>
              <span class="text-primary">{{form.startDate | moment("HH:mm DD/MM/YYYY")}}</span>
              <span> đến </span>
              <span class="text-primary">{{form.endDate | moment("HH:mm DD/MM/YYYY")}}</span>
            </div>
          </el-alert>
        </el-row>
        <el-row :gutter="10" type="flex" align="middle" class="padding-bottom-10">
          <el-col :span="12">
            <el-card shadow="never">
              <div class="padding-20 bg-info text-light">
                <span class="text-bold">Số đơn đã tạo</span>
                <br>
                <span class="text-very-large text-bold">{{reportData.totalOrderCount}}</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="never">
              <div class="padding-20 text-light bg-danger">
                <span class="text-bold">Số đơn bị hủy</span>
                <br>
                <span class="text-very-large text-bold">{{reportData.totalCancelledCount}}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="10" type="flex" align="middle">
          <el-col :span="12">
            <el-card shadow="never">
              <div class="padding-20 bg-warning text-light">
                <span class="text-bold">Số đơn đã thanh toán</span>
                <br>
                <span class="text-very-large text-bold">{{reportData.totalPurchasedCount}}</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="never">
              <div class="bg-yellowgreen text-light padding-20">
                <span class="text-bold">Doanh thu</span>
                <br>
                <span class="text-very-large text-bold">{{reportData.totalRevenue | priceAppend}}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import PosSaleReportService from "@/service/pos/pos.sale-report.service";
  import PosStoreUserService from "@/service/pos/pos.store-user-service";
  import hasAnyRole from "@/utils/has-any-role";

  export default {
    name: "SaleReport",
    data() {
      const defaultEnd = new Date();
      const defaultStart = new Date();
      defaultStart.setHours(0, 0, 0, 0);

      return {
        isLoading: true,
        dateFormat: 'HH:mm:ss dd/MM/yyyy',
        pickerOptions: {
          shortcuts: [
            {
              text: 'Hôm nay',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setHours(0, 0, 0, 0);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '7 ngày trước',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '30 ngày trước',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }]
        },
        form: {
          storeGuid: null,
          userLogin: "",
          startDate: null,
          endDate: null,
        },
        dateRange: [defaultStart, defaultEnd],
        listStoreUser: [],
        storeUserRoles: {
          STORE_OWNER: "STORE_OWNER",
          STORE_MANAGER: "STORE_MANAGER",
          STORE_WAITER: "STORE_WAITER",
          STORE_CASHIER: "STORE_CASHIER",
        },
        reportData: {
          totalRevenue: null,
          totalOrderCount: null,
          totalPurchasedCount: null,
          totalCancelledCount: null,
        },
        currentStoreUserRole: null,
      };
    },
    async created() {
      await this.getCurrentStoreUserRole();
      if (["STORE_MANAGER", "STORE_OWNER"].includes(this.currentStoreUserRole)) {
        this.getListStoreUser();
      }
      this.handleGetReport();
    },
    methods: {
      async getCurrentStoreUserRole() {
        const {data} = await PosStoreUserService.getCurrentStoreUserRole(this.$route.params.storeGuid);
        this.currentStoreUserRole = data;
      },
      async handleGetReport() {
        this.isLoading = true;
        if (["STORE_MANAGER", "STORE_OWNER"].includes(this.currentStoreUserRole)) {
          await this.getSaleReport();
        } else {
          await this.getCurrentUserSaleReport();
        }
        setTimeout(() => this.isLoading = false, 500);
      },
      hasAnyRole: hasAnyRole,
      goBack() {
        this.$router.go(-1);
      },
      async getCurrentUserSaleReport() {
        this.form.storeGuid = this.$route.params.storeGuid;
        this.form.startDate = this.dateRange[0];
        this.form.endDate = this.dateRange[1];
        const {data} = await PosSaleReportService.getCurrentUserSaleReport(this.form);
        this.reportData = data;
      },
      async getSaleReport() {
        this.form.storeGuid = this.$route.params.storeGuid;
        this.form.startDate = this.dateRange[0];
        this.form.endDate = this.dateRange[1];
        const {data} = await PosSaleReportService.getSaleReport(this.form);
        this.reportData = data;
      },
      async getListStoreUser() {
        const {data} = await PosStoreUserService.getStoreUser(this.$route.params.storeGuid);
        this.listStoreUser = data;
      }
    }
  };
</script>

<style scoped>
  /deep/ .el-card__header {
    padding: 0
  }

  /deep/ .el-card__body {
    padding: 0;
    line-height: 30px;
  }
</style>
