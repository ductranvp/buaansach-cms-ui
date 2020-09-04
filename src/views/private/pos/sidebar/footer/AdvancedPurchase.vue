<template>
  <el-drawer
    size="450px"
    :close-on-click-modal="false"
    :visible.sync="drawerVisible"
    :direction="direction"
    :show-close="false"
    @opened="onOpened"
    :before-close="beforeClose">
    <el-container class="full-size" direction="vertical">
      <el-header height="40px" class="bg-success">
        <el-row type="flex" align="middle" class="full-size text-light text-bold" justify="center">
          <span class="text-medium">Tùy chọn thanh toán</span>
        </el-row>
      </el-header>
      <el-main class="full-size padding-20">
        <el-form onsubmit="return false">
          <el-form-item>
            <el-row type="flex" align="bottom">
              <el-col :span="11">
                <input-label label="Mã giảm giá" optional/>
                <el-input ref="voucherCode"
                          v-if="!currentOrder.hasVoucher"
                          @keyup.native.enter="applyVoucher"
                          v-model="voucherCode"></el-input>
                <el-button v-else
                           disabled
                           class="full-width"
                           type="success"
                           plain>
                  <span>Đã áp dụng</span>
                </el-button>
              </el-col>
              <el-col :span="11" :offset="2">
                <el-button v-if="!currentOrder.hasVoucher"
                           @click="applyVoucher"
                           :loading="isLoading"
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
        <el-row style="line-height: 28px" v-if="currentOrder.hasVoucher">
          <el-alert :closable="false">
            <div>Tên mã giảm giá: {{currentOrder.voucherName}}</div>
            <div v-if="currentOrder.voucherDiscountType === 'VALUE'">
              <span>Giảm giá: {{currentOrder.voucherDiscount |priceAppend}}</span>
            </div>
            <div v-if="currentOrder.voucherDiscountType === 'PERCENT'">
              <span>Giảm giá: {{currentOrder.voucherDiscount}}%</span>
            </div>
            <div v-if="currentOrder.voucherCustomerPhone">
              <span>Áp dụng cho SĐT: {{currentOrder.voucherCustomerPhone}}</span>
            </div>
            <div v-if="currentOrder.voucherCreatedDate">
              <span>Ngày tạo: {{currentOrder.voucherCreatedDate | moment("HH:mm - DD/MM/YYYY")}}</span>
            </div>
          </el-alert>
        </el-row>
      </el-main>
      <el-footer height="auto" id="no_border">
        <el-row type="flex" align="middle">
          <el-button @click="hide" type="warning"
                     class="no-border-radius no-border full-width text-large padding-20-10">
            <i class="el-icon-close"></i>
            <span>Đóng (Esc)</span>
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
          let total = state.posMachine.currentOrder.totalAmount;
          let discount = state.posMachine.currentOrder.orderDiscount;
          let discountType = state.posMachine.currentOrder.orderDiscountType;
          if (discount) {
            if (discountType === "VALUE") {
              amount = discount;
            } else {
              amount = (Math.floor(total * discount / 100));
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
        isLoading: false,
        drawerVisible: false,
        direction: 'ltr',
        voucherCode: null,
      };
    },
    methods: {
      onOpened() {
        if (this.$refs.voucherCode)
          this.$refs.voucherCode.focus();
      },
      async applyVoucher() {
        if (this.voucherCode) {
          let payload = {
            orderGuid: this.currentOrder.guid,
            customerPhone: this.currentOrder.customerPhone,
            voucherCode: this.voucherCode,
          };
          try {
            this.isLoading = true;
            await PosVoucherCodeService.applyVoucher(payload);
            this.isLoading = false;
          } catch (e) {
            this.isLoading = false;
            const message = e.message || e.data.message;
            let errorMsg = "Mã giảm giá không khả dụng";
            switch (message) {
              case 'disabled':
                errorMsg = "Mã giảm giá đã bị vô hiệu hóa";
                break;
              case 'invalid':
                errorMsg = "Mã giảm giá không hợp lệ";
                break;
              case 'expired':
                errorMsg = "Mã giảm giá đã hết hạn";
                break;
              case 'maxUsed':
                errorMsg = "Mã giảm giá đã hết lượt sử dụng";
                break;
              case 'invalidStore':
                errorMsg = "Mã giảm giá không hợp lệ";
                break;
            }
            MessageUtils.error(errorMsg);
          }

          try {
            await this.$store.dispatch("posMachine/getSeatOrderInfo", this.selectedSeat.guid);
          } catch (e) {
            MessageUtils.error("Lỗi tải lại dữ liệu đơn hàng, vui lòng tải lại trang");
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
          MessageUtils.error("Đã xảy ra lỗi, vui lòng thử lại");
        }
        try {
          await this.$store.dispatch("posMachine/getSeatOrderInfo", this.selectedSeat.guid);
        } catch (e) {
          MessageUtils.error("Lỗi tải lại dữ liệu đơn hàng");
        }
      },
      show() {
        this.drawerVisible = true;
      },
      hide() {
        this.drawerVisible = false;
        this.resetForm();
      },
      resetForm() {
        this.voucherCode = null;
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
