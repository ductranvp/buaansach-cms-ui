<template>
  <el-container class="full-size" direction="vertical">
    <el-header height="auto">
      <el-row class="full-size">
        <el-col :span="12">
          <el-input v-model="currentOrder.customerName" placeholder="Tên Khách">
            <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-input v-model="currentOrder.customerPhone" placeholder="SĐT Khách">
            <i slot="prefix" class="el-input__icon el-icon-phone"></i>
          </el-input>
        </el-col>
      </el-row>
      <el-divider class="margin-0 full-width bg-info"></el-divider>
    </el-header>
    <el-main class="full-size">
      <el-row type="flex" align="middle" class="full-size">
        <el-col :span="11" class="full-height">
          <el-input v-model="customerCharge" placeholder="Khách đưa">
            <i slot="prefix" class="el-input__icon el-icon-money"></i>
            <el-button style="color: #606266" disabled slot="suffix">
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
    <el-footer height="auto" style="border-top: 1px solid #eee">
      <el-row type="flex" align="middle">
        <el-col :span="20">
          <el-button type="success" @click="completeOrder" class="full-width text-large padding-20-10">
            <i class="el-icon-printer"></i>
            <span>Thanh toán: </span>
            <span>{{totalCharge | priceAppend }}</span>
          </el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="warning" class="text-large full-width padding-20-10" @click="showAdvancedPurchase">
            <i class="fas el-icon-fa-tags"></i>
          </el-button>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script>
  import {mapState} from "vuex";
  import MessageUtils from "@/utils/message.util";
  import MessageBoxUtils from "@/utils/message-box.util";

  export default {
    name: "BasicPurchase",
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
        currentOrder: state => state.posMachine.currentOrder,
      })
    },
    data() {
      return {
        customerCharge: null,
      };
    },
    watch: {
      currentOrder: function () {
        this.customerCharge = null;
      }
    },
    methods: {
      showAdvancedPurchase() {
        this.$emit("showAdvancedPurchase");
      },
      completeOrder() {
        const vm = this;
        if (this.customerCharge * 1000 < this.totalCharge) {
          MessageUtils.error("Số tiền khách đưa phải lớn hơn hoặc bằng số tiền thanh toán");
          return;
        }
        if (!this.savedOrderProduct.length) {
          MessageUtils.error("Chưa có sản phẩm nào trong đơn hàng");
          return;
        }
        const payload = {
          paymentMethod: "CASH",
          totalCharge: this.totalCharge,
          customerCharge: this.customerCharge,
        };
        if (this.unsavedOrderProduct.length) {
          MessageBoxUtils.confirm("Đơn hàng có sản phẩm chưa được lưu, vẫn tiếp tục?", function () {
            vm.$store.dispatch("posMachine/completeOrder", payload).then(function () {
              vm.customerCharge = null;
            });
          });
        } else {
          this.$store.dispatch("posMachine/completeOrder", payload).then(function () {
            vm.customerCharge = null;
          });
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

  /deep/ .el-input__inner:not(#drawer) {
    border: 0 !important;
    border-radius: 0 !important;
  }

  /deep/ .el-button {
    border: 0 !important;
    border-radius: 0 !important;
  }

</style>
