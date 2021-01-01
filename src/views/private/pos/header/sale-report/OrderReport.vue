<template>
  <el-container>
    <el-main v-loading="isLoading" class="padding-0-10">
      <div v-if="!isLoading">
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
        <el-row
          :gutter="10"
          align="middle"
          class="padding-bottom-10"
          type="flex"
        >
          <el-col :span="8">
            <el-card shadow="never">
              <el-main class="padding-10-20 bg-info text-light">
                <el-row>
                  <span class="text-bold">Số đơn đã tạo / tiếp nhận</span>
                </el-row>
                <el-row align="middle" type="flex">
                  <el-col>
                    <span class="text-very-large text-bold">{{
                      parsedReportData.listTotal.length
                    }}</span>
                  </el-col>
                  <el-col class="text-right">
                    <el-button
                      @click="showReportDialog(parsedReportData.listTotal)"
                      >Chi tiết
                    </el-button>
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
                <el-row align="middle" type="flex">
                  <el-col>
                    <span class="text-very-large text-bold">{{
                      parsedReportData.listInStore.length
                    }}</span>
                  </el-col>
                  <el-col class="text-right">
                    <el-button
                      @click="showReportDialog(parsedReportData.listInStore)"
                      >Chi tiết
                    </el-button>
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
                <el-row align="middle" type="flex">
                  <el-col>
                    <span class="text-very-large text-bold">{{
                      parsedReportData.listTakeAway.length
                    }}</span>
                  </el-col>
                  <el-col class="text-right">
                    <el-button
                      @click="showReportDialog(parsedReportData.listTakeAway)"
                      >Chi tiết
                    </el-button>
                  </el-col>
                </el-row>
              </el-main>
            </el-card>
          </el-col>
        </el-row>

        <el-row
          :gutter="10"
          align="middle"
          class="padding-bottom-10"
          type="flex"
        >
          <el-col :span="12">
            <el-card shadow="never">
              <el-main class="padding-10-20 bg-danger text-light">
                <el-row>
                  <span class="text-bold">Số đơn bị hủy</span>
                </el-row>
                <el-row align="middle" type="flex">
                  <el-col>
                    <span class="text-very-large text-bold">{{
                      parsedReportData.listCancelled.length
                    }}</span>
                  </el-col>
                  <el-col class="text-right">
                    <el-button
                      @click="
                        showReportDialog(
                          parsedReportData.listCancelled,
                          'cancelled'
                        )
                      "
                      >Chi tiết
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
                <el-row align="middle" type="flex">
                  <el-col>
                    <span class="text-very-large text-bold">{{
                      parsedReportData.listPurchased.length
                    }}</span>
                  </el-col>
                  <el-col class="text-right">
                    <el-button
                      @click="
                        showReportDialog(
                          parsedReportData.listPurchased,
                          'purchased'
                        )
                      "
                      >Chi tiết
                    </el-button>
                  </el-col>
                </el-row>
              </el-main>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="10" align="middle" type="flex">
          <el-col :span="12">
            <el-row :gutter="10" align="middle" type="flex">
              <el-col :span="16">
                <el-card shadow="never">
                  <el-main class="padding-10-20 bg-warning text-light">
                    <el-row>
                      <span class="text-bold">Khuyến mãi</span>
                    </el-row>
                    <el-row align="middle" style="height: 40px" type="flex">
                      <el-col :span="12">
                        <span class="text-small">Trên hóa đơn: </span>
                        <span class="text-very-large text-bold">{{
                          parsedReportData.totalDiscount | priceAppend
                        }}</span>
                      </el-col>
                      <el-col :span="12">
                        <span class="text-small">Thực tế: </span>
                        <span class="text-very-large text-bold">{{
                          (parsedReportData.totalRealDiscount -
                            parsedReportData.totalPointValue)
                            | priceAppend
                        }}</span>
                      </el-col>
                    </el-row>
                  </el-main>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card shadow="never">
                  <el-main class="padding-10-20 bg-warning text-light">
                    <el-row>
                      <span class="text-bold">Điểm thưởng</span>
                    </el-row>
                    <el-row align="middle" style="height: 40px" type="flex">
                      <span class="text-very-large text-bold">{{
                        parsedReportData.totalPointValue | priceAppend
                      }}</span>
                    </el-row>
                  </el-main>
                </el-card>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-card shadow="never">
              <el-main class="padding-10-20 bg-success text-light">
                <el-row>
                  <span class="text-bold">Doanh thu</span>
                </el-row>
                <el-row align="middle" style="height: 40px" type="flex">
                  <el-col>
                    <span class="text-small">Trên hóa đơn: </span>
                    <span class="text-very-large text-bold">{{
                      parsedReportData.totalRevenue | priceAppend
                    }}</span>
                  </el-col>
                  <el-col>
                    <span class="text-small">Thực tế: </span>
                    <span class="text-very-large text-bold">{{
                      parsedReportData.totalRealRevenue | priceAppend
                    }}</span>
                  </el-col>
                  <el-col>
                    <span class="text-small">Thực thu: </span>
                    <span class="text-very-large text-bold">{{
                      parsedReportData.totalRealMoney | priceAppend
                    }}</span>
                  </el-col>
                </el-row>
              </el-main>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <el-row class="padding-top-10">
        <el-alert :closable="false" style="line-height: 30px" type="warning">
          <ul class="text-large">
            <li>
              <b>Khuyến mãi trên hóa đơn</b>: Tổng số tiền khuyến mãi dựa trên
              giá trị các mã khuyến mãi.
            </li>
            <li>
              <b>Khuyến mãi thực tế</b>: Tổng số tiền khuyến mãi thực tế được
              hưởng. (VD: Khuyến mãi 50k cho đơn 30k thì thực tế hưởng khuyến
              mãi là 30k)
            </li>
            <li>
              <b>Doanh thu trên hóa đơn</b>: Tổng số tiền sản phẩm đã phục vụ
              của các hóa đơn.
            </li>
            <li>
              <b>Doanh thu thực tế</b>: Tổng số tiền phải thanh toán của các hóa
              đơn. (Sau khi đã trừ các khuyến mãi và điểm thưởng)
            </li>
            <li>
              <b>Doanh thu thực thu</b>: Số tiền thu về theo nguyên tắc: >=500đ
              làm tròn lên, ngược lại làm tròn xuống.
            </li>
          </ul>
        </el-alert>
      </el-row>
    </el-main>
    <sale-report-detail-dialog
      v-if="!isLoading"
      ref="reportDialog"
      :current-store-user-role="currentStoreUserRole"
    />
  </el-container>
</template>

<script>
import PosSaleReportService from "@/service/pos/pos.sale-report.service";
import SaleReportDetailDialog from "@/views/private/pos/header/sale-report/SaleReportDetailDialog";
import PriceUtils from "@/utils/price.util";
import OrderStatus from "@/enum/OrderStatus";
import OrderType from "@/enum/OrderType";
import ErrorUtils from "@/utils/error.util";
import AppUtils from "@/utils/app.util";

export default {
  name: "OrderReport",
  components: { SaleReportDetailDialog },
  data() {
    return {
      isLoading: false,
      form: {
        storeGuid: null,
        userLogin: null,
        startDate: null,
        endDate: null
      },
      listStoreUser: [],
      reportForUser: null,
      reportData: {},
      orderStatus: OrderStatus.value,
      orderType: OrderType.value,
      parsedReportData: {
        totalRevenue: 0,
        totalDiscount: 0,
        totalRealDiscount: 0,
        totalRealRevenue: 0,
        totalPointValue: 0,
        totalRealMoney: 0,
        listTotal: [],
        listCancelled: [],
        listPurchased: [],
        listInStore: [],
        listTakeAway: [],
        listOnline: []
      },
      currentStoreUserRole: null
    };
  },
  methods: {
    showReportDialog(data, type) {
      this.$refs.reportDialog.show(data, type);
    },
    async getReport(form, listStoreUser, currentStoreUserRole) {
      this.isLoading = true;
      this.form = AppUtils.deepCopy(form);
      this.listStoreUser = AppUtils.deepCopy(listStoreUser);
      this.currentStoreUserRole = currentStoreUserRole;
      if (["STORE_MANAGER", "STORE_OWNER"].includes(currentStoreUserRole)) {
        await this.getSaleReport();
      } else {
        await this.getCurrentUserSaleReport();
      }
      setTimeout(() => (this.isLoading = false), 300);
    },
    parseReportData() {
      this.parsedReportData = {};
      this.parsedReportData.listTotal = this.reportData;
      this.parsedReportData.listPurchased = this.reportData.filter(
        item => item.orderStatus === this.orderStatus.PURCHASED
      );
      this.parsedReportData.listCancelled = this.reportData.filter(
        item => item.orderStatus === this.orderStatus.CANCELLED
      );
      this.parsedReportData.listInStore = this.reportData.filter(
        item => item.orderType === this.orderType.IN_STORE
      );
      this.parsedReportData.listTakeAway = this.reportData.filter(
        item => item.orderType === this.orderType.TAKE_AWAY
      );
      this.parsedReportData.listOnline = this.reportData.filter(
        item => item.orderType === this.orderType.ONLINE
      );

      this.parsedReportData.totalRevenue = this.parsedReportData.listPurchased.reduce(
        (acc, item) => {
          return acc + item.orderTotalAmount;
        },
        0
      );

      this.parsedReportData.totalPointValue = this.parsedReportData.listPurchased.reduce(
        (acc, item) => {
          return acc + item.orderPointValue;
        },
        0
      );

      this.parsedReportData.totalRealRevenue = this.parsedReportData.listPurchased.reduce(
        (acc, item) => {
          let payAmount = PriceUtils.getPayAmount(
            item.orderTotalAmount,
            item.orderDiscount,
            item.orderDiscountType,
            item.orderPointValue
          );
          return acc + payAmount;
        },
        0
      );

      this.parsedReportData.totalRealMoney = this.parsedReportData.listPurchased.reduce(
        (acc, item) => {
          let payAmount = PriceUtils.getPayAmount(
            item.orderTotalAmount,
            item.orderDiscount,
            item.orderDiscountType,
            item.orderPointValue
          );
          let remain = payAmount % 1000;
          let div = Math.floor(payAmount / 1000);
          if (remain !== 0) {
            if (remain >= 500) payAmount = (div + 1) * 1000;
            else payAmount = div * 1000;
          }
          return acc + payAmount;
        },
        0
      );

      this.parsedReportData.totalRealDiscount =
        this.parsedReportData.totalRevenue -
        this.parsedReportData.totalRealRevenue;

      this.parsedReportData.totalDiscount = this.parsedReportData.listPurchased.reduce(
        (acc, item) => {
          let discountAmount = PriceUtils.getDiscountAmount(
            item.orderTotalAmount,
            item.orderDiscount,
            item.orderDiscountType
          );
          return acc + discountAmount;
        },
        0
      );
    },
    async getCurrentUserSaleReport() {
      try {
        const { data } = await PosSaleReportService.getCurrentUserSaleReport(
          this.form
        );
        this.reportData = data;
        this.parseReportData();
      } catch (error) {
        ErrorUtils.showActionErrorMessage(
          error,
          "Lỗi tải thông tin thống kê, vui lòng thử lại sau!"
        );
      }
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
        const { data } = await PosSaleReportService.getSaleReport(this.form);
        this.reportData = data;
        this.parseReportData();
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

<style scoped>
/deep/ .el-card__header {
  padding: 0;
}

/deep/ .el-card__body {
  padding: 0;
  line-height: 30px;
}
</style>
