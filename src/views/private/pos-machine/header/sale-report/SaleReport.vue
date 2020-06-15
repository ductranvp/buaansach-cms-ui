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
              <el-tooltip content="Tài khoản của bạn">
                <el-button type="success">
                  <i class="el-icon-user"></i>
                  <span>{{currentUser.login}}</span>
                </el-button>
              </el-tooltip>
            </div>
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
                range-separator="tới"
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
          <el-col :span="8">
            <el-card shadow="never">
              <el-main class="padding-10-20 bg-info text-light">
                <el-row>
                  <span class="text-bold">Số đơn đã tạo / tiếp nhận</span>
                </el-row>
                <el-row type="flex" align="middle">
                  <el-col>
                    <span class="text-very-large text-bold">{{parsedReportData.listTotal.length}}</span>
                  </el-col>
                  <el-col class="text-right">
                    <el-button @click="showReportDialog(parsedReportData.listTotal)">Chi tiết</el-button>
                  </el-col>
                </el-row>
              </el-main>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="never">
              <el-main class="padding-10-20 bg-info text-light">
                <el-row>
                  <span class="text-bold">Số đơn ăn tại quán</span>
                </el-row>
                <el-row type="flex" align="middle">
                  <el-col>
                    <span class="text-very-large text-bold">{{parsedReportData.listInStore.length}}</span>
                  </el-col>
                  <el-col class="text-right">
                    <el-button @click="showReportDialog(parsedReportData.listInStore)">Chi tiết</el-button>
                  </el-col>
                </el-row>
              </el-main>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="never">
              <el-main class="padding-10-20 bg-info text-light">
                <el-row>
                  <span class="text-bold">Số đơn mang về</span>

                </el-row>
                <el-row type="flex" align="middle">
                  <el-col>
                    <span class="text-very-large text-bold">{{parsedReportData.listTakeAway.length}}</span>
                  </el-col>
                  <el-col class="text-right">
                    <el-button @click="showReportDialog(parsedReportData.listTakeAway)">Chi tiết</el-button>
                  </el-col>
                </el-row>
              </el-main>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter="10" type="flex" align="middle" class="padding-bottom-10">
          <el-col :span="12">
            <el-card shadow="never">
              <el-main class="padding-10-20 bg-danger text-light">
                <el-row>
                  <span class="text-bold">Số đơn bị hủy</span>
                </el-row>
                <el-row type="flex" align="middle">
                  <el-col>
                    <span class="text-very-large text-bold">{{parsedReportData.listCancelled.length}}</span>
                  </el-col>
                  <el-col class="text-right">
                    <el-button @click="showReportDialog(parsedReportData.listCancelled, 'cancelled')">Chi tiết
                    </el-button>
                  </el-col>
                </el-row>
              </el-main>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="never">
              <el-main class="padding-10-20 bg-yellowgreen text-light">
                <el-row>
                  <span class="text-bold">Số đơn đã thanh toán</span>
                </el-row>
                <el-row type="flex" align="middle">
                  <el-col>
                    <span class="text-very-large text-bold">{{parsedReportData.listPurchased.length}}</span>
                  </el-col>
                  <el-col class="text-right">
                    <el-button @click="showReportDialog(parsedReportData.listPurchased, 'purchased')">Chi tiết
                    </el-button>
                  </el-col>
                </el-row>
              </el-main>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="10" type="flex" align="middle">
          <el-col :span="12">
            <el-card shadow="never">
              <el-main class="padding-10-20 bg-warning text-light">
                <el-row>
                  <span class="text-bold">Khuyến mãi</span>
                </el-row>
                <el-row type="flex" align="middle" style="height: 40px">
                  <el-col>
                    <span class="text-small">Trên hóa đơn: </span>
                    <span class="text-very-large text-bold">{{parsedReportData.totalDiscount | priceAppend}}</span>
                  </el-col>
                  <el-col>
                    <span class="text-small">Thực tế: </span>
                    <span class="text-very-large text-bold">{{parsedReportData.totalRealDiscount | priceAppend}}</span>
                  </el-col>
                </el-row>
              </el-main>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="never">
              <el-main class="padding-10-20 bg-success text-light">
                <el-row>
                  <span class="text-bold">Doanh thu</span>
                </el-row>
                <el-row type="flex" align="middle" style="height: 40px">
                  <el-col>
                    <span class="text-small">Trên hóa đơn: </span>
                    <span class="text-very-large text-bold">{{parsedReportData.totalRevenue | priceAppend}}</span>
                  </el-col>
                  <el-col>
                    <span class="text-small">Thực tế: </span>
                    <span class="text-very-large text-bold">{{parsedReportData.totalRealRevenue | priceAppend}}</span>
                  </el-col>
                </el-row>
              </el-main>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-main>
    <el-footer height="auto">
      <el-row>
        <el-alert style="line-height: 30px" :closable="false" type="warning">
          <ul class="text-large">
            <li><b>Khuyến mãi trên hóa đơn</b>: Tổng số tiền khuyến mãi dựa trên giá trị các mã khuyến mãi.</li>
            <li><b>Khuyến mãi thực tế</b>: Tổng số tiền khuyến mãi thực tế được hưởng. (VD: Khuyến mãi 50k cho đơn 30k thì thực
              tế khuyến mãi là 30k)
            </li>
            <li><b>Doanh thu trên hóa đơn</b>: Tổng số tiền sản phẩm đã phục vụ của các hóa đơn.</li>
            <li><b>Doanh thu thực tế</b>: Tổng số tiền phải thanh toán của các hóa đơn. (Là số tiền nhân viên thu về)</li>
          </ul>
        </el-alert>
      </el-row>
    </el-footer>
    <sale-report-detail-dialog v-if="!isLoading" :current-store-user-role="currentStoreUserRole" ref="reportDialog"/>
  </el-container>
</template>

<script>
  import PosSaleReportService from "@/service/pos/pos.sale-report.service";
  import PosStoreUserService from "@/service/pos/pos.store-user-service";
  import hasAnyRole from "@/utils/has-any-role";
  import MessageUtils from "@/utils/message.util";
  import {mapState} from "vuex";
  import SaleReportDetailDialog from "@/views/private/pos-machine/header/sale-report/SaleReportDetailDialog";
  import PriceUtils from "@/utils/price.util";

  export default {
    name: "SaleReport",
    components: {SaleReportDetailDialog},
    computed: {
      ...mapState({
        orderStatus: state => state.posMachine.orderStatus,
        orderType: state => state.posMachine.orderType,
        currentUser: state => state.user.info,
      })
    },
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
              text: 'Hôm qua',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24);
                start.setHours(0, 0, 0, 0);
                end.setHours(0, 0, 0, 0);
                end.setTime(end.getTime() - 1000);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '7 ngày trước',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                start.setHours(0, 0, 0, 0);
                end.setHours(0, 0, 0, 0);
                end.setTime(end.getTime() - 1000);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '30 ngày trước',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                start.setHours(0, 0, 0, 0);
                end.setHours(0, 0, 0, 0);
                end.setTime(end.getTime() - 1000);
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
        reportData: {},
        parsedReportData: {
          totalRevenue: 0,
          totalDiscount: 0,
          totalRealDiscount: 0,
          totalRealRevenue: 0,
          listTotal: [],
          listCancelled: [],
          listPurchased: [],
          listInStore: [],
          listTakeAway: [],
          listOnline: [],
        },
        currentStoreUserRole: null,
      };
    },
    async created() {
      this.isLoading = true;
      /* get all area for display seat - area on order report */
      await this.$store.dispatch("posMachine/getAllArea", this.$route.params.storeGuid);
      await this.getCurrentStoreUserRole();
      if (["STORE_MANAGER", "STORE_OWNER"].includes(this.currentStoreUserRole)) {
        this.getListStoreUser();
      }
      this.handleGetReport();
    },
    methods: {
      showReportDialog(data, type) {
        this.$refs.reportDialog.show(data, type);
      },
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
        setTimeout(() => this.isLoading = false, 300);
      },
      hasAnyRole: hasAnyRole,
      goBack() {
        this.$router.go(-1);
      },
      async getCurrentUserSaleReport() {
        this.form.storeGuid = this.$route.params.storeGuid;
        this.form.startDate = this.dateRange[0];
        this.form.endDate = this.dateRange[1];
        try {
          const {data} = await PosSaleReportService.getCurrentUserSaleReport(this.form);
          this.reportData = data;
          this.parseReportData();
        } catch (error) {
          MessageUtils.error("Lỗi tải thông tin thống kê, vui lòng thử lại sau!");
        }
      },
      parseReportData() {
        this.parsedReportData = {};
        this.parsedReportData.listTotal = this.reportData;
        this.parsedReportData.listPurchased = this.reportData.filter(item => item.orderStatus === this.orderStatus.PURCHASED);
        this.parsedReportData.listCancelled = this.reportData.filter(item => item.orderStatus.includes("CANCELLED"));
        this.parsedReportData.listInStore = this.reportData.filter(item => item.orderType === this.orderType.IN_STORE);
        this.parsedReportData.listTakeAway = this.reportData.filter(item => item.orderType === this.orderType.TAKE_AWAY);
        this.parsedReportData.listOnline = this.reportData.filter(item => item.orderType === this.orderType.ONLINE);

        this.parsedReportData.totalRevenue = this.parsedReportData.listPurchased.reduce((acc, item) => {
          return acc + item.totalAmount;
        }, 0);

        this.parsedReportData.totalRealRevenue = this.parsedReportData.listPurchased.reduce((acc, item) => {
          let payAmount = PriceUtils.getPayAmount(item.totalAmount, item.orderDiscount, item.orderDiscountType);
          return acc + payAmount;
        }, 0);

        this.parsedReportData.totalRealDiscount = this.parsedReportData.totalRevenue - this.parsedReportData.totalRealRevenue;

        this.parsedReportData.totalDiscount = this.parsedReportData.listPurchased.reduce((acc, item) => {
          let discountAmount = PriceUtils.getDiscountAmount(item.totalAmount, item.orderDiscount, item.orderDiscountType);
          return acc + discountAmount;
        }, 0);
      },
      async getSaleReport() {
        this.form.storeGuid = this.$route.params.storeGuid;
        this.form.startDate = this.dateRange[0];
        this.form.endDate = this.dateRange[1];
        try {
          const {data} = await PosSaleReportService.getSaleReport(this.form);
          this.reportData = data;
          this.parseReportData();
        } catch (e) {
          MessageUtils.error("Lỗi tải thông tin thống kê, vui lòng thử lại sau!");
        }
      },
      async getListStoreUser() {
        try {
          const {data} = await PosStoreUserService.getStoreUser(this.$route.params.storeGuid);
          this.listStoreUser = data;
        } catch (e) {
          MessageUtils.error("Lỗi tải danh sách nhân viên, vui lòng thử lại sau!");
        }
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
