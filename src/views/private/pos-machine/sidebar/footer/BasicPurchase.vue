<template>
  <el-container class="full-size" direction="vertical">
    <bill ref="billPage"/>
    <create-customer-dialog ref="customerDialog"/>
    <el-container class="full-size" direction="vertical" id="basic_purchase">
      <el-header height="auto">
        <el-row class="full-size">
          <el-col class="full-height">
            <el-autocomplete
              @keyup.enter.native="updateCustomerPhone"
              @keyup.esc.native="cancelEditCustomerPhone"
              ref="customerPhone"
              :class="isEditCustomerPhone ? 'edit-phone' : ''"
              class="full-size"
              popper-class="my-autocomplete"
              placement="top-start"
              :popper-append-to-body="true"
              :trigger-on-focus="false"
              :debounce="300"
              :disabled="!isEditCustomerPhone"
              v-model="currentOrder.customerPhone"
              :fetch-suggestions="queryCustomer"
              placeholder="SĐT Khách hàng (F4)"
              :maxlength="10"
              @select="handleSelect">
              <i slot="prefix" class="el-input__icon el-icon-phone"></i>
              <el-row class="full-size" type="flex" align="middle" slot="suffix">
                <div v-if="isEditCustomerPhone">
                  <el-tooltip class="item" effect="dark" content="Lưu" placement="top">
                    <el-button :loading="isLoading" @click="updateCustomerPhone" class="full-size margin-0">
                      <i class="fas el-icon-fa-check"></i>
                    </el-button>
                  </el-tooltip>

                </div>
                <div v-if="isEditCustomerPhone">
                  <el-tooltip class="item" effect="dark" content="Hủy" placement="top">
                    <el-button @click="cancelEditCustomerPhone" class="full-size margin-0">
                      <i class="fas el-icon-fa-times"></i>
                    </el-button>
                  </el-tooltip>

                </div>
                <div v-else>
                  <el-tooltip class="item" effect="dark" content="Sửa" placement="top">
                    <el-button @click="editCustomerPhone" class="full-size margin-0">
                      <i class="fas el-icon-fa-edit"></i>
                    </el-button>
                  </el-tooltip>

                </div>
                <div>
                  <el-tooltip class="item" effect="dark" content="Thêm Khách Hàng" placement="top">
                    <el-button @click="createCustomer" class="full-size">
                      <i class="fas el-icon-fa-user-plus"></i>
                    </el-button>
                  </el-tooltip>
                </div>
              </el-row>
              <template slot-scope="{ item }">
                <div v-if="!item.customerPhone">
                  <div class="value">Không tìm thấy khách hàng</div>
                </div>
                <div v-else>
                  <div class="value">{{ item.customerName }}</div>
                  <span class="link">{{ item.customerPhone }}</span>
                </div>
              </template>
            </el-autocomplete>
          </el-col>
        </el-row>
        <el-divider class="margin-0 full-width bg-success"></el-divider>
      </el-header>
      <el-main class="full-size">
        <el-container direction="vertical">
          <el-row type="flex" align="middle" style="height: 40px">
            <el-col :span="12" class="full-height">
              <el-input ref="customerPay" @keyup.native.enter="completeOrder(customerPay)" v-model="customerPay"
                        placeholder="Khách đưa (F8)">
                <i slot="prefix" class="el-input__icon el-icon-money"></i>
                <el-button class="full-size" style="color: #606266" disabled slot="suffix">
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
          <el-row type="flex" align="middle" style="height: 40px">
            <el-col :span="12" class="full-height">
              <el-button style="color: #606266; padding: 12px 10px" disabled class="full-size text-left">
                <i class="el-icon-money"></i>
                <span>Tổng: </span>
                <span v-if="totalAmount > 0">{{totalAmount | priceAppend}}</span>
                <span v-else>0</span>
              </el-button>
            </el-col>
            <el-col :span="12" class="full-height">
              <el-button style="color: #606266;  padding: 12px 10px" disabled class="full-size text-left">
                <i class="el-icon-discount"></i>
                <span>Giảm giá: </span>
                <span v-if="discountAmount > 0">{{discountAmount | priceAppend}}</span>
                <span v-else>0</span>
              </el-button>
            </el-col>
          </el-row>
        </el-container>
      </el-main>
      <el-footer height="auto">
        <el-row type="flex" align="middle">
          <el-col :span="20">
            <el-button :loading="isLoading" :disabled="currentOrder.orderStatus === 'CREATED'" type="success"
                       @click="completeOrder(customerPay)" class="full-width text-large padding-20-10">
              <i class="el-icon-printer"></i>
              <span>Thanh toán: </span>
              <span v-if="payAmount > 0">{{payAmount | priceAppend }}</span>
              <span v-else>0</span>
            </el-button>
          </el-col>
          <el-col :span="4">
            <el-tooltip class="item" effect="dark" content="Khuyến mãi (F9)" placement="top">
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
  import Bill from "@/views/private/pos-machine/bill/Bill";
  import PosCustomerService from "@/service/pos/pos.customer.service";
  import Constants from "@/utils/constants";
  import MessageUtils from "@/utils/message.util";
  import PosOrderService from "@/service/pos/pos.order.service";
  import CreateCustomerDialog from "@/views/private/pos-machine/sidebar/footer/CreateCustomerDialog";
  import MessageBoxUtils from "@/utils/message-box.util";
  import hotkeys from "hotkeys-js";

  export default {
    name: "BasicPurchase",
    components: {CreateCustomerDialog, Bill},
    computed: {
      ...mapState({
        savedOrderProduct: state => state.posMachine.savedOrderProduct,
        unsavedOrderProduct: state => state.posMachine.unsavedOrderProduct,
        selectedSeat: state => state.posMachine.selectedSeat,
        currentOrder: state => state.posMachine.currentOrder,
        totalAmount: state => state.posMachine.currentOrder.totalAmount,
        orderProductStatus: state => state.posMachine.orderProductStatus,
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
        customerPay: null,
        backupCustomerPhone: null,
        isEditCustomerPhone: false
      };
    },
    mounted() {
      const vm = this;
      hotkeys.filter = function (event) {
        return true;
      };
      hotkeys('f4', 'posMachine', function (event, handler) {
        vm.editCustomerPhone();
      });
      hotkeys('f8', 'posMachine', function (event, handler) {
        vm.$refs.customerPay.focus();
      });
      hotkeys('f9', 'posMachine', function (event, handler) {
        vm.showAdvancedPurchase();
      });
      hotkeys.setScope("posMachine");
    },
    watch: {
      currentOrder: function () {
        this.customerPay = null;
      }
    },
    methods: {
      createCustomer() {
        this.$refs.customerDialog.create();
      },
      showAdvancedPurchase() {
        this.$emit("showAdvancedPurchase");
      },
      async updateCustomerPhone() {
        if (this.backupCustomerPhone === this.currentOrder.customerPhone) {
          this.isEditCustomerPhone = false;
          return;
        }
        /* when order has apply voucher code, if change customer phone, voucher will be remove */
        let willVoucherBeCancelled = false;
        if (this.currentOrder.voucherCustomerPhone != null) {
          try {
            await MessageBoxUtils.confirmPromise("Thay đổi số điện thoại sẽ hủy mã voucher, tiếp tục?");
            willVoucherBeCancelled = true;
          } catch (e) {
            return;
          }
        }

        /* validate phone number*/
        const patt = new RegExp(Constants.PHONE_REGEX);
        if (this.currentOrder.customerPhone && !patt.test(this.currentOrder.customerPhone)) {
          MessageUtils.error("Số điện thoại không hợp lệ");
          return;
        }
        this.isLoading = true;
        /* check if phone existed or not */
        try {
          if (this.currentOrder.customerPhone) {
            await PosCustomerService.getCustomerByPhone(this.currentOrder.customerPhone);
          }
        } catch (e) {
          MessageUtils.error("Số điện thoại không tồn tại trong hệ thống. Vui lòng Thêm Khách Khàng trước");
        }

        /* perform update customer phone */
        try {
          await PosOrderService.changeCustomerPhone({
            seatGuid: this.currentOrder.seatGuid,
            orderGuid: this.currentOrder.guid,
            newCustomerPhone: this.currentOrder.customerPhone
          });
          this.isEditCustomerPhone = false;
          this.isLoading = false;
        } catch (e) {
          this.isLoading = false;
          MessageUtils.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
        }

        /* reload seat order info when voucher has been cancelled */
        if (willVoucherBeCancelled) {
          try {
            await this.$store.dispatch("posMachine/getSeatOrderInfo", this.selectedSeat.guid);
          } catch (e) {
            MessageUtils.error("Lỗi tải lại dữ liệu đơn hàng");
          }
        }
      },
      async queryCustomer(customerPhone, cb) {
        if (customerPhone.length === 10) {
          try {
            const {data} = await PosCustomerService.getCustomerByPhone(customerPhone);
            cb([data]);
          } catch (e) {
            cb([{}]);
          }
        } else {
          cb([{}]);
        }
      },
      handleSelect(item) {
        this.currentOrder.customerPhone = item.customerPhone;
      },
      editCustomerPhone() {
        const vm = this;
        vm.backupCustomerPhone = JSON.parse(JSON.stringify(vm.currentOrder.customerPhone));
        setTimeout(() => {
          vm.$refs.customerPhone.focus();
        }, 1);
        vm.isEditCustomerPhone = true;
      },
      cancelEditCustomerPhone() {
        const vm = this;
        vm.currentOrder.customerPhone = JSON.parse(JSON.stringify(vm.backupCustomerPhone));
        vm.backupCustomerPhone = null;
        vm.isEditCustomerPhone = false;
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

        if (this.isEditCustomerPhone) {
          MessageUtils.error("Số điện thoại khách chưa được lưu");
          return;
        }
        if (customerPay === null || customerPay === "") {
          MessageUtils.error("Vui lòng nhập số tiền khách đưa");
          return;
        }
        if (customerPay * 1000 < this.payAmount) {
          MessageUtils.error("Số tiền khách đưa phải lớn hơn hoặc bằng số tiền thanh toán");
          return;
        }
        const payload = {
          paymentMethod: "CASH",
          paymentNote: null,
        };
        try {
          this.isLoading = true;
          await vm.$store.dispatch("posMachine/completeOrder", payload);
          this.isLoading = false;
          vm.$refs.billPage.printBill(JSON.parse(JSON.stringify(customerPay * 1000)), function () {
            // this function is called when print is done;
            vm.$store.dispatch("posMachine/printDone");
            vm.customerPay = null;
            MessageUtils.success("Thanh toán thành công");
          });
        } catch (error) {
          this.isLoading = false;
          MessageUtils.error("Thanh toán không thành công, vui lòng thử lại");
        }

      }
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
