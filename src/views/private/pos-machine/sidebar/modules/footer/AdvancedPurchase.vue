<template>
  <el-drawer
    size="450px"
    :modal="false"
    :close-on-click-modal="false"
    :visible.sync="drawerVisible"
    :direction="direction"
    :show-close="false"
    :before-close="beforeClose">
    <el-container class="full-size" direction="vertical">
      <el-header height="50px" class="bg-success">
        <el-row type="flex" align="middle" class="full-size text-light text-bold" justify="center">
          <span class="text-large">Thanh Toán + Khuyến Mãi</span>
        </el-row>
      </el-header>
      <el-main class="full-size padding-20">
        <el-form>
          <el-form-item>
            <el-col :span="11">
              <input-label label="Tên khách hàng" optional/>
              <el-input v-model="currentOrder.customerName"></el-input>
            </el-col>
            <el-col :span="11" :offset="2">
              <input-label label="SĐT khách hàng" optional/>
              <el-input v-model="currentOrder.customerPhone"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-row type="flex" align="bottom">
              <el-col :span="11">
                <input-label label="Mã giảm giá" optional/>
                <el-input></el-input>
              </el-col>
              <el-col :span="11" :offset="2">
                <el-button class="full-width">Tìm kiếm</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-main>
      <el-footer height="auto">
        <el-row>
          <el-input placeholder="Khách đưa" v-model="customerCharge">
            <template slot="append">x1000</template>
          </el-input>
        </el-row>
        <el-row type="flex" align="middle">
          <el-button style="color: #606266" disabled class="full-size text-left">
            <span>Trả lại: </span>
            <span v-if="totalCharge && customerCharge*1000 >= totalCharge">{{customerCharge*1000 - totalCharge | priceAppend}}</span>
          </el-button>
        </el-row>
        <el-row>
          <el-button @click="completeOrder" type="success" class="no-border-radius no-border padding-20-10 full-width text-large">
            <i class="el-icon-printer"></i>
            <span>Thanh toán: {{totalCharge | priceAppend}}</span>
          </el-button>
        </el-row>
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
  import MessageBoxUtils from "@/utils/message-box.util";

  export default {
    name: "AdvancedPurchase",
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
        drawerVisible: false,
        direction: 'ltr',
        customerCharge: null,
      };
    },
    methods: {
      show() {
        this.drawerVisible = true;
      },
      hide() {
        this.drawerVisible = false;
        this.resetForm();
      },
      resetForm() {
        this.customerCharge = null;
      },
      beforeClose(done) {
        this.resetForm();
        done();
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

<style scoped>

  /deep/ .el-input__inner {
    border-radius: 4px !important;
    border: 1px solid #DCDFE6 !important;
  }

</style>
