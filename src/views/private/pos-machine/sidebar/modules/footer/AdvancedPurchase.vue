<template>
  <el-drawer
    size="450px"
    :close-on-click-modal="false"
    :visible.sync="drawerVisible"
    :direction="direction"
    :show-close="false"
    :before-close="beforeClose">
    <el-container class="full-size" direction="vertical">
      <el-header height="40px" class="bg-success">
        <el-row type="flex" align="middle" class="full-size text-light text-bold" justify="center">
          <span class="text-medium">Khuyến Mãi</span>
        </el-row>
      </el-header>
      <el-main class="full-size padding-20">
        <el-form>
          <el-form-item>
            <el-row type="flex" align="bottom">
              <el-col :span="11">
                <input-label label="Mã giảm giá" optional/>
                <el-input v-if="!currentOrder.orderVoucherCode" v-model="voucherCode"></el-input>
                <el-input v-else disabled v-model="currentOrder.orderVoucherCode"></el-input>
              </el-col>
              <el-col :span="11" :offset="2">
                <el-button v-if="!currentOrder.orderVoucherCode" @click="applyVoucher"
                           class="full-width"
                           type="success"
                           plain>
                  <span>Áp Dụng</span>
                </el-button>
                <el-button v-else @click="cancelVoucher" class="full-width" type="danger" plain>Hủy</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <el-row style="line-height: 28px" v-if="currentOrder.orderVoucherCode">
          <el-alert :closable="false">
            <div>Tên voucher: {{voucherCodeInfo.voucherName}}</div>
            <div v-if="voucherCodeInfo.voucherDiscountType === 'VALUE'">
              <span>Giảm giá: {{voucherCodeInfo.voucherDiscount |priceAppend}}</span>
            </div>
            <div v-if="voucherCodeInfo.voucherDiscountType === 'PERCENT'">
              <span>Giảm giá: {{voucherCodeInfo.voucherDiscount}}%</span>
            </div>
            <div v-if="voucherCodeInfo.customerPhone">
              <span>Áp dụng cho SĐT: {{voucherCodeInfo.customerPhone}}</span>
            </div>
            <div v-if="voucherCodeInfo.createdDate">
              <span>Ngày tạo: {{voucherCodeInfo.createdDate | moment("HH:mm - DD/MM/YYYY")}}</span>
            </div>
          </el-alert>
        </el-row>
      </el-main>
      <el-footer height="auto" id="no_border">
        <el-row type="flex" align="middle">
          <el-button @click="hide" type="warning"
                     class="no-border-radius no-border full-width text-large padding-20-10">
            <i class="el-icon-close"></i>
            <span>Đóng</span>
          </el-button>
        </el-row>
      </el-footer>
    </el-container>
  </el-drawer>
</template>

<script>
  import {mapState} from "vuex";
  import MessageUtils from "@/utils/message.util";
  import PosVoucherCodeService from "@/service/pos/pos.voucher-code.service";
  import NotificationUtils from "@/utils/notification.util";

  export default {
    name: "AdvancedPurchase",
    computed: {
      ...mapState({
        savedOrderProduct: state => state.posMachine.savedOrderProduct,
        unsavedOrderProduct: state => state.posMachine.unsavedOrderProduct,
        currentOrder: state => state.posMachine.currentOrder,
        selectedSeat: state => state.posMachine.selectedSeat,
        totalAmount: state => state.posMachine.currentOrder.totalAmount,
        discountAmount: state => {
          let amount = 0;
          let discount = state.posMachine.currentOrder.orderDiscount;
          let discountType = state.posMachine.currentOrder.orderDiscountType;
          if (discount) {
            if (discountType === "VALUE") {
              amount = discount;
            } else {
              amount = (Math.floor(amount * discount / 100));
            }
          }
          return amount > 0 ? amount : 0;
        },
        payAmount: state => {
          let amount = state.posMachine.currentOrder.totalAmount;
          let discount = state.posMachine.currentOrder.orderDiscount;
          let discountType = state.posMachine.currentOrder.orderDiscountType;
          if (discount) {
            if (discountType === "VALUE") {
              amount = amount - discount;
            } else {
              amount = amount - (Math.floor(amount * discount / 100));
            }
          }
          return amount > 0 ? amount : 0;
        },
      })
    },
    data() {
      return {
        customerPay: null,
        drawerVisible: false,
        direction: 'ltr',
        voucherCode: null,
        voucherCodeInfo: {}
      };
    },
    methods: {
      async getVoucherInfo(voucherCode) {
        const {data} = await PosVoucherCodeService.getVoucherCodeInfo(voucherCode);
        this.voucherCodeInfo = data;
      },
      async applyVoucher() {
        if (this.voucherCode) {
          let payload = {
            orderGuid: this.currentOrder.guid,
            customerPhone: this.currentOrder.customerPhone,
            voucherCode: this.voucherCode,
          };
          try {
            await PosVoucherCodeService.applyVoucher(payload);
            this.getVoucherInfo(this.voucherCode);
          } catch (e) {
            const message = e.message || e.data.message;
            let errorMsg = "Mã voucher không khả dụng";
            switch (message) {
              case 'disabled':
                errorMsg = "Mã đã bị vô hiệu hóa";
                break;
              case 'invalid':
                errorMsg = "Mã không hợp lệ";
                break;
              case 'expired':
                errorMsg = "Mã đã hết hạn";
                break;
              case 'maxUsed':
                errorMsg = "Mã đã hết lượt sử dụng";
                break;
              case 'invalidStore':
                errorMsg = "Mã không hợp lệ";
                break;
            }
            NotificationUtils.error(errorMsg);
          }

          try {
            await this.$store.dispatch("posMachine/getSeatOrderInfo", this.selectedSeat.guid);
          } catch (e) {
            NotificationUtils.error("Lỗi tải lại dữ liệu đơn hàng, vui lòng tải lại trang");
          }
        } else {
          MessageUtils.error("Vui lòng nhập mã voucher");
        }
      },
      async cancelVoucher() {
        let payload = {
          orderGuid: this.currentOrder.guid,
        };
        try {
          await PosVoucherCodeService.cancelVoucher(payload);
        } catch (e) {
          NotificationUtils.error("Đã xảy ra lỗi, vui lòng thử lại");
        }
        try {
          await this.$store.dispatch("posMachine/getSeatOrderInfo", this.selectedSeat.guid);
        } catch (e) {
          NotificationUtils.error("Lỗi tải lại dữ liệu đơn hàng");
        }
      },
      show() {
        if (this.currentOrder.orderVoucherCode)
          this.getVoucherInfo(this.currentOrder.orderVoucherCode);
        this.drawerVisible = true;
      },
      hide() {
        this.drawerVisible = false;
        this.resetForm();
      },
      resetForm() {
        this.customerPay = null;
      },
      beforeClose(done) {
        this.resetForm();
        done();
      }
    }
  };
</script>

<style scoped>

</style>
