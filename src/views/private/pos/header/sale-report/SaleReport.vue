<template>
  <el-container class="full-size" direction="vertical">
    <el-header class="bg-success  padding-0-10" height="50px">
      <el-row align="middle" class="full-size" type="flex">
        <el-button size="medium" type="success" @click="goBack">
          <i class="el-icon-arrow-left"></i>
          <span>Quay lại</span>
        </el-button>
        <el-col>
          <el-row align="middle" justify="end" type="flex">
            <div class="padding-right-10">
              <el-tooltip content="Tài khoản của bạn">
                <el-button size="medium" type="success">
                  <i class="el-icon-user"></i>
                  <span>{{ currentUser.fullName }}</span>
                </el-button>
              </el-tooltip>
            </div>
            <div class="padding-right-10">
              <el-select
                v-if="
                  ['STORE_MANAGER', 'STORE_OWNER'].includes(
                    this.currentStoreUserRole
                  )
                "
                v-model="form.userLogin"
                placeholder="Chọn nhân viên"
                size="medium"
              >
                <el-option label="Tất cả nhân viên" value=""></el-option>
                <el-option
                  v-for="u in listStoreUser"
                  :key="u.userLogin"
                  :label="u.fullName"
                  :value="u.userLogin"
                ></el-option>
              </el-select>
            </div>
            <div class="padding-right-10">
              <el-date-picker
                v-model="dateRange"
                :format="dateFormat"
                :picker-options="pickerOptions"
                align="right"
                end-placeholder="Ngày kết thúc"
                range-separator="tới"
                size="medium"
                start-placeholder="Ngày bắt đầu"
                type="datetimerange"
              >
              </el-date-picker>
            </div>
            <div>
              <el-button size="medium" type="warning" @click="handleGetReport"
                >Xem thống kê
              </el-button>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-row type="flex" align="middle" justify="center" class="padding-10">
        <el-radio-group v-model="activeTab">
          <el-radio-button label="SUMMARY">Tổng Quan</el-radio-button>
          <el-radio-button label="ORDER_PRODUCT">Sản Phẩm</el-radio-button>
        </el-radio-group>
      </el-row>
      <sale-summary ref="summary" v-show="activeTab === 'SUMMARY'" />
      <order-product-report
        ref="orderProduct"
        v-show="activeTab === 'ORDER_PRODUCT'"
      />
    </el-main>
  </el-container>
</template>

<script>
import PosStoreUserService from "@/service/pos/pos.store-user-service";
import StoreUserRole from "@/enum/StoreUserRole";
import ErrorUtils from "@/utils/error.util";
import SaleSummary from "@/views/private/pos/header/sale-report/SaleSummary";
import OrderProductReport from "@/views/private/pos/header/sale-report/OrderProductReport";

export default {
  name: "SaleReport",
  components: { OrderProductReport, SaleSummary },
  data() {
    const defaultEnd = new Date();
    const defaultStart = new Date();
    defaultStart.setHours(0, 0, 0, 0);

    return {
      dateFormat: "HH:mm:ss dd/MM/yyyy",
      pickerOptions: {
        shortcuts: [
          {
            text: "Ca sáng",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setHours(0, 0, 0, 0);
              end.setHours(10, 0, 0, 0);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "Ca trưa",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setHours(10, 0, 0, 0);
              end.setHours(14, 0, 0, 0);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "Ca tối",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setHours(17, 0, 0, 0);
              end.setHours(21, 0, 0, 0);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "Hôm nay",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setHours(0, 0, 0, 0);
              end.setHours(23, 59, 59, 999);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "Hôm qua",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              start.setHours(0, 0, 0, 0);
              end.setHours(0, 0, 0, 0);
              end.setTime(end.getTime() - 1000);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "7 ngày trước",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              start.setHours(0, 0, 0, 0);
              end.setHours(0, 0, 0, 0);
              end.setTime(end.getTime() - 1000);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      form: {
        storeGuid: null,
        userLogin: "",
        startDate: null,
        endDate: null
      },
      dateRange: [defaultStart, defaultEnd],
      listStoreUser: [],
      storeUserRoles: StoreUserRole.value,
      currentStoreUserRole: null,
      activeTab: "SUMMARY"
    };
  },
  async created() {
    /* get all area for display seat - area on order report */
    await this.$store.dispatch(
      "posMachine/getAllArea",
      this.$route.params.storeGuid
    );
    this.initData();
  },
  methods: {
    async initData() {
      await this.getCurrentStoreUserRole();
      // only manager or owner can get list store user
      if (
        [
          this.storeUserRoles.STORE_MANAGER,
          this.storeUserRoles.STORE_OWNER
        ].includes(this.currentStoreUserRole)
      ) {
        await this.getListStoreUser();
      }
      this.handleGetReport();
    },
    async getCurrentStoreUserRole() {
      const { data } = await PosStoreUserService.getCurrentStoreUserRole(
        this.$route.params.storeGuid
      );
      this.currentStoreUserRole = data;
    },
    async handleGetReport() {
      this.form.storeGuid = this.$route.params.storeGuid;
      this.form.startDate = this.dateRange[0];
      this.form.endDate = this.dateRange[1];
      this.$refs.summary.getReport(
        this.form,
        this.listStoreUser,
        this.currentStoreUserRole
      );
      this.$refs.orderProduct.getReport(
        this.form,
        this.listStoreUser,
        this.currentStoreUserRole
      );
    },
    goBack() {
      this.$router.go(-1);
    },
    async getListStoreUser() {
      try {
        const { data } = await PosStoreUserService.getStoreUser(
          this.$route.params.storeGuid
        );
        this.listStoreUser = data;
      } catch (error) {
        ErrorUtils.showErrorMessage(
          error,
          "Lỗi tải danh sách nhân viên, vui lòng thử lại sau!"
        );
      }
    }
  }
};
</script>

<style scoped></style>
