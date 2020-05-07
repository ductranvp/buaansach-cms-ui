<template>
  <el-container class="full-size" direction="vertical">
    <el-header height="auto">
      <el-row class="full-size">
        <el-col class="full-height">
          <el-autocomplete
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
            placeholder="SĐT Khách hàng"
            :maxlength="10"
            @select="handleSelect">
            <i slot="prefix" class="el-input__icon el-icon-phone"></i>
            <el-row class="full-size" type="flex" align="middle" slot="suffix">
              <div v-if="isEditCustomerPhone">
                <el-tooltip class="item" effect="dark" content="Lưu" placement="top">
                  <el-button @click="updateCustomerPhone" class="full-size margin-0">
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
      <el-divider class="margin-0 full-width bg-info"></el-divider>
    </el-header>
    <el-main class="full-size">
      <el-row type="flex" align="middle" class="full-size">
        <el-col :span="11" class="full-height">
          <el-input v-model="customerCharge" placeholder="Khách đưa">
            <i slot="prefix" class="el-input__icon el-icon-money"></i>
            <el-button class="full-size" style="color: #606266" disabled slot="suffix">
              <span>x1000</span>
            </el-button>
          </el-input>
        </el-col>
        <el-col class="full-height text-center bg-light" :span="2">
          <el-divider class="margin-0 bg-success full-height" direction="vertical"></el-divider>
        </el-col>
        <el-col :span="11" class="full-height">
          <el-button style="color: #606266" disabled class="full-size text-left">
            <span v-if="totalCharge && customerCharge*1000 >= totalCharge">Trả lại:  {{customerCharge*1000 - totalCharge | priceAppend}}</span>
          </el-button>
        </el-col>
      </el-row>
    </el-main>
    <el-footer height="auto">
      <el-row type="flex" align="middle">
        <el-col :span="20">
          <el-button type="success" @click="completeOrder" class="full-width text-large padding-20-10">
            <i class="el-icon-printer"></i>
            <span>Thanh toán: </span>
            <span>{{totalCharge | priceAppend }}</span>
          </el-button>
        </el-col>
        <el-col :span="4">
          <el-tooltip class="item" effect="dark" content="Khuyến mãi" placement="top">
            <el-button type="warning" class="text-large full-width padding-20-10" @click="showAdvancedPurchase">
              <i class="fas el-icon-fa-tags"></i>
            </el-button>
          </el-tooltip>
        </el-col>
      </el-row>
      <bill ref="billPage" style="visibility: hidden"/>
      <create-customer-dialog ref="customerDialog"/>
    </el-footer>
  </el-container>
</template>

<script>
  import {mapState} from "vuex";
  import Bill from "@/views/private/pos-machine/bill/Bill";
  import PosCustomerService from "@/service/pos/pos.customer.service";
  import Constants from "@/utils/constants";
  import MessageUtils from "@/utils/message.util";
  import NotificationUtils from "@/utils/notification.util";
  import PosOrderService from "@/service/pos/pos.order.service";
  import CreateCustomerDialog from "@/views/private/pos-machine/sidebar/modules/footer/CreateCustomerDialog";

  export default {
    name: "BasicPurchase",
    components: {CreateCustomerDialog, Bill},
    computed: {
      ...mapState({
        totalCharge: state => {
          return state.posMachine.savedOrderProduct
            .filter(item => item.orderProductStatus.indexOf("CANCELLED") === -1)
            .map(item => item.orderProductPrice * item.orderProductQuantity)
            .reduce((prev, curr) => prev + curr, 0);
        },
        savedOrderProduct: state => state.posMachine.savedOrderProduct,
        unsavedOrderProduct: state => state.posMachine.unsavedOrderProduct,
        currentOrder: state => state.posMachine.currentOrder
      })
    },
    data() {
      return {
        backupCustomerPhone: null,
        customerCharge: null,
        isEditCustomerPhone: false
      };
    },
    watch: {
      currentOrder: function () {
        this.customerCharge = null;
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
        const patt = new RegExp(Constants.PHONE_REGEX);
        if (this.currentOrder.customerPhone && !patt.test(this.currentOrder.customerPhone)) {
          MessageUtils.error("Số điện thoại không hợp lệ");
          return;
        }
        try {
          if (this.currentOrder.customerPhone) {
            await PosCustomerService.getCustomerByPhone(this.currentOrder.customerPhone);
          }
          await PosOrderService.changeCustomerPhone({
            seatGuid: this.currentOrder.seatGuid,
            orderGuid: this.currentOrder.guid,
            newCustomerPhone: this.currentOrder.customerPhone
          });
          NotificationUtils.success("Cập nhật SĐT thành công");
          this.isEditCustomerPhone = false;
        } catch (e) {
          MessageUtils.error("Số điện thoại không tồn tại trong hệ thống. Vui lòng Thêm Khách Khàng trước");
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
      async completeOrder() {
        const vm = this;
        if (this.unsavedOrderProduct.length) {
          MessageUtils.error("Đơn hàng có sản phẩm chưa được lưu");
          return;
        }
        if (!this.savedOrderProduct.length) {
          MessageUtils.error("Chưa có sản phẩm nào trong đơn hàng");
          return;
        }
        if (this.isEditCustomerPhone) {
          MessageUtils.error("Số điện thoại khách chưa được lưu");
          return;
        }
        if (this.customerCharge === null || this.customerCharge === "") {
          MessageUtils.error("Vui lòng nhập số tiền khách đưa");
          return;
        }
        if (this.customerCharge * 1000 < this.totalCharge) {
          MessageUtils.error("Số tiền khách đưa phải lớn hơn hoặc bằng số tiền thanh toán");
          return;
        }
        const payload = {
          paymentMethod: "CASH",
          totalCharge: this.totalCharge,
          customerCharge: this.customerCharge,
        };
        try {
          await vm.$store.dispatch("posMachine/completeOrder", payload);
          vm.$refs.billPage.printBill(JSON.parse(JSON.stringify(this.customerCharge * 1000)), function () {
            vm.$store.dispatch("posMachine/printDone", payload);
            vm.customerCharge = null;
            NotificationUtils.success("Thanh toán thành công");
          });
        } catch (error) {
          // do nothing
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

  /deep/ .el-input__inner {
    border: 0;
    border-radius: 0;
  }

  /deep/ .el-button {
    border: 0;
    border-radius: 0;
  }

  /deep/ .el-input__suffix {
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
