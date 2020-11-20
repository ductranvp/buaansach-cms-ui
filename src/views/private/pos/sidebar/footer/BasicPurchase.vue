<template>
  <el-container class="full-size" direction="vertical">
    <bill ref="billPage"/>
    <el-container class="full-size" direction="vertical" id="basic_purchase">
      <el-main class="full-size">
        <el-container direction="vertical">
          <el-row type="flex" align="middle" style="height: 40px">
            <el-col :span="12" class="full-height">
              <el-button style="color: #606266; padding: 12px 10px" disabled class="full-size text-left">
                <i class="el-icon-money"></i>
                <span>Tổng: </span>
                <span v-if="orderTotalAmount > 0">{{orderTotalAmount | priceAppend}}</span>
                <span v-else>0</span>
              </el-button>
            </el-col>
            <el-col :span="12" class="full-height">
              <el-button style="color: #606266;  padding: 12px 10px" disabled class="full-size text-left">
                <i class="el-icon-discount"></i>
                <span>Giảm giá: </span>
                <span v-if="discountAmount > 0">{{discountAmount | priceAppend}}</span>
                <span v-else>{{0 | priceAppend}}</span>
              </el-button>
            </el-col>
          </el-row>
          <el-divider class="margin-0 full-width bg-success"></el-divider>

          <el-row type="flex" align="middle" style="height: 40px">
              <el-col class="full-height" :span="12">
                <el-input ref="orderCustomerPhone" disabled v-model="currentOrder.orderCustomerPhone"
                          placeholder="Số điện thoại khách">
                  <i slot="prefix" class="el-input__icon el-icon-phone"></i>
                </el-input>
              </el-col>
            <el-col :span="12" class="full-height">
              <el-button style="color: #606266; padding: 12px 10px" disabled class="full-size text-left">
                <i class="el-icon-present"></i>
                <span>Điểm: </span>
                <span>{{currentOrder.orderPointValue}} </span>
              </el-button>
            </el-col>
          </el-row>
          <el-divider class="margin-0 full-width bg-success"></el-divider>

          <el-row type="flex" align="middle" style="height: 40px">
            <el-col :span="12" class="full-height">
              <el-input ref="customerPay" @keyup.native.enter="completeOrder(customerPay)" v-model="customerPay"
                        placeholder="Khách đưa (F9)">
                <i slot="prefix" class="el-input__icon el-icon-money"></i>
                <el-button class="full-size" style="color: #606266; padding: 12px 10px" disabled slot="suffix">
                  <span>x1000</span>
                </el-button>
              </el-input>
            </el-col>
            <el-col :span="12" class="full-height">
              <el-button style="color: #606266; padding: 12px 10px" disabled class="full-size text-left">
                <i class="el-icon-money"></i>
                <span>Trả lại: </span>
                <span v-if="customerPay*1000 > payAmount">{{customerPay*1000 - payAmount | priceAppend}}</span>
                <span v-else>0</span>
              </el-button>
            </el-col>
          </el-row>
          <el-divider class="margin-0 full-width bg-success"></el-divider>
        </el-container>
      </el-main>
      <el-footer height="auto">
        <el-row type="flex" align="middle">
          <el-col :span="20">
            <el-button :loading="isLoading" :disabled="currentOrder.orderStatus === orderStatus.CREATED" type="success"
                       @click="completeOrder(customerPay)" class="full-width text-large padding-20-10">
              <i class="el-icon-printer"></i>
              <span>Thanh toán: </span>
              <span v-if="payAmount > 0">{{payAmount | priceAppend }}</span>
              <span v-else>0</span>
            </el-button>
          </el-col>
          <el-col :span="4">
            <el-tooltip class="item" effect="dark" content="Tùy chọn khác" placement="top">
              <el-button type="warning" class="text-large full-width padding-20-10" @click="showAdvancedPurchase">
                <i class="fas el-icon-fa-tags"></i>
              </el-button>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
  import {mapState} from "vuex";
  import Bill from "@/views/private/pos/bill/Bill";
  import MessageUtils from "@/utils/message.util";
  import hotkeys from "hotkeys-js";
  import OrderProductStatus from '@/enum/OrderProductStatus';
  import PriceUtils from '@/utils/price.util';
  import OrderStatus from '@/enum/OrderStatus';
  import PaymentMethod from '@/enum/PaymentMethod';
  import ErrorUtils from '@/utils/error.util';

  export default {
    name: "BasicPurchase",
    components: {Bill},
    computed: {
      ...mapState({
        savedOrderProduct: state => state.posMachine.savedOrderProduct,
        unsavedOrderProduct: state => state.posMachine.unsavedOrderProduct,
        selectedSeat: state => state.posMachine.selectedSeat,
        currentOrder: state => state.posMachine.currentOrder,
        orderTotalAmount: state => state.posMachine.currentOrder.orderTotalAmount,
        discountAmount: state => {
          const {orderTotalAmount, orderDiscount, orderDiscountType} = state.posMachine.currentOrder;
          return PriceUtils.getDiscountAmount(orderTotalAmount, orderDiscount, orderDiscountType);
        },
        payAmount: state => {
          const {orderTotalAmount, orderDiscount, orderDiscountType, orderPointValue} = state.posMachine.currentOrder;
          return PriceUtils.getPayAmount(orderTotalAmount, orderDiscount, orderDiscountType, orderPointValue);
        },
      })
    },
    data() {
      return {
        isLoading: false,
        customerPay: null,
        orderProductStatus: OrderProductStatus.value,
        orderStatus: OrderStatus.value,
        paymentMethod: PaymentMethod.value,
      };
    },
    mounted() {
      const vm = this;
      hotkeys.filter = function (event) {
        return true;
      };
      hotkeys('f9', 'posMachine', function (event, handler) {
        vm.$refs.customerPay.focus();
      });
      hotkeys.setScope("posMachine");
    },
    watch: {
      currentOrder: function () {
        this.customerPay = null;
      }
    },
    methods: {
      showAdvancedPurchase() {
        this.$emit("showAdvancedPurchase");
      },
      async completeOrder(customerPay) {
        const vm = this;
        if (this.unsavedOrderProduct.length) {
          MessageUtils.error("Đơn hàng có sản phẩm chưa được lưu");
          return;
        }

        if (!this.savedOrderProduct.length) {
          MessageUtils.error("Chưa có sản phẩm nào trong đơn hàng");
          return;
        }

        const listPreparingOrderProduct = this.savedOrderProduct
          .filter(item => item.orderProductStatus === this.orderProductStatus.PREPARING);

        if (listPreparingOrderProduct.length > 0) {
          MessageUtils.error("Đơn hàng có sản phẩm chưa được phục vụ");
          return;
        }

        if (customerPay === null || customerPay === "") {
          MessageUtils.error("Vui lòng nhập số tiền khách đưa");
          return;
        }
        if (customerPay * 1000 < this.payAmount) {
          MessageUtils.error("Số tiền khách đưa phải lớn hơn hoặc bằng số tiền cần thanh toán");
          return;
        }
        const payload = {
          paymentMethod: this.paymentMethod.CASH,
          paymentNote: null,
        };
        try {
          this.isLoading = true;
          await vm.$store.dispatch("posMachine/completeOrder", payload);
          this.isLoading = false;
          vm.$refs.billPage.printBill(JSON.parse(JSON.stringify(customerPay * 1000)), function () {
            // this function is called when print is done;
            vm.$store.dispatch("posMachine/printDone");
            vm.$store.dispatch("posMachine/reloadAllStoreNotification");
            vm.customerPay = null;
            MessageUtils.success("Thanh toán thành công");
          });
        } catch (error) {
          this.isLoading = false;
          ErrorUtils.showActionErrorMessage(error, "Thanh toán không thành công, vui lòng thử lại");
        }

      },
    }
  };
</script>

<style lang="scss" scoped>
  .icon-button {
    padding: 0;
    height: 50px;
    width: 70px;
    font-size: 28px
  }

  /deep/ #basic_purchase .el-input__inner {
    border: 0;
    border-radius: 0;
  }

  /deep/ #basic_purchase .el-button {
    border: 0;
    border-radius: 0;
  }

  /deep/ #basic_purchase .el-input__suffix {
    right: 0;
  }

  .edit-phone {
    color: red !important;
    background-color: red;
  }

  .my-autocomplete {
    li {
      line-height: normal;
      padding: 0;

      .value {
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .link {
        font-size: 12px;
        color: #b4b4b4;
      }
    }
  }
</style>
