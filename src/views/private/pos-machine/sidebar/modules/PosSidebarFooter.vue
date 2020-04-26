<template>
  <el-footer v-if="currentOrder.guid" class="bg-success padding-10" height="auto">
    <el-container class="full-size" direction="vertical">
      <el-header height="auto">
        <el-row type="flex" align="middle">
          <el-col class="margin-right-10">
            <el-input placeholder="SĐT Khách Hàng">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-col>
          <el-button class="icon-button" type="success" v-if="!showAdvanced" @click="showAdvanced = true"><i
            class="el-icon-arrow-up"></i></el-button>
          <el-button class="icon-button" type="success" v-else @click="showAdvanced = false"><i
            class="el-icon-arrow-down"></i></el-button>
        </el-row>
      </el-header>

      <el-main>
        <template v-if="showAdvanced">
          <el-row type="flex" class="padding-top-10">
            <el-col>
              <el-input placeholder="Mã khuyến mãi">
                <i slot="prefix" class="el-input__icon el-icon-discount"></i>
                <el-button slot="append">Tìm</el-button>
              </el-input>
            </el-col>
          </el-row>
          <el-row type="flex" class="padding-top-10" align="top">
            <el-col class="text-light text-bold" style="line-height: 25px" :span="14">
              <span>Ngày cấp:</span>
              <br>
              <span>Giảm giá:</span>
            </el-col>
            <el-col :span="10">
              <el-button class="full-width">Áp dụng</el-button>
            </el-col>
          </el-row>
        </template>
      </el-main>
      <el-footer height="auto">
        <el-divider class="margin-10-0"></el-divider>
        <el-row :gutter="10" type="flex" align="middle">
          <el-col>
            <el-select size="small" v-model="payment">
              <el-option v-for="item in paymentMethod" :key="item.value" :value="item.value"
                         :label="item.label"></el-option>
            </el-select>
          </el-col>
          <el-col>
            <el-input size="small" v-if="payment === 'CASH' " v-model="customerCharge"
                      v-currency
                      placeholder="Khách đưa"></el-input>
            <el-button v-else class="full-width">Tạo mã thanh toán</el-button>
          </el-col>
          <el-col>
            <span class="text-light" v-if="customerCharge">Trả lại: {{$parseCurrency(customerCharge) - totalCharge | price}}</span>
          </el-col>
        </el-row>
        <el-row class="padding-top-20" :gutter="10" type="flex" align="middle">
          <el-col class="text-light text-bold" :span="16">
            <span>Thanh toán: </span>
            <span>{{totalCharge | price }}</span>
          </el-col>
          <el-col :span="8">
            <el-button @click="completeOrder" class="full-width">
              <i class="el-icon-printer"></i>
              <span>IN HÓA ĐƠN</span>
            </el-button>
          </el-col>
        </el-row>
      </el-footer>
    </el-container>
  </el-footer>
</template>

<script>
  import {mapState} from "vuex";
  import MessageUtils from "@/utils/message.util";

  export default {
    name: "PosSidebarFooter",
    computed: {
      ...mapState({
        totalCharge: state => {
          return state.posMachine.savedOrderProduct
            .map(item => item.orderProductPrice * item.orderProductQuantity)
            .reduce((prev, curr) => prev + curr, 0);
        },
        savedOrderProduct: state => state.posMachine.savedOrderProduct,
        paymentMethod: state => state.posMachine.paymentMethod,
        currentOrder: state => state.posMachine.currentOrder,
      })
    },
    data() {
      return {
        customerCharge: null,
        payment: "CASH",
        showAdvanced: false,
      };
    },
    methods: {
      completeOrder() {
        const vm = this;
        if (this.$parseCurrency(this.customerCharge) < this.totalCharge) {
          MessageUtils.error("Số tiền khách đưa phải lớn hơn hoặc bằng số tiền thanh toán");
          return;
        }
        if (!this.savedOrderProduct.length) {
          MessageUtils.error("Chưa có sản phẩm nào trong đơn hàng");
          return;
        }
        this.$store.dispatch("posMachine/completeOrder", {
          paymentMethod: this.payment,
          totalCharge: this.totalCharge,
          customerCharge: this.customerCharge,
          vm: vm,
        }).then(function () {
          vm.customerCharge = null;
          vm.payment = "CASH";
          vm.showAdvanced = null;
        });
      }
    }
  };
</script>

<style scoped>
  .icon-button {
    padding: 0;
    height: 40px;
    width: 50px;
    font-size: 28px
  }
</style>
