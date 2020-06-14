<template>
  <el-row class="full-size" type="flex" align="middle" justify="center">
    <el-col :span="10">
      <el-form onsubmit="return false" ref="createOrderForm" :model="form" :rules="formRules">
        <el-form-item>
          <el-row type="flex" align="middle" justify="center">
            <qrcode class="pointer" @click.native="goto(selectedSeat.guid)" :value="seatPrefixUrl + selectedSeat.guid"></qrcode>
          </el-row>
        </el-form-item>
<!--        <el-form-item>-->
<!--          <el-alert style="line-height: 28px;" type="warning" :closable="false">-->
<!--            <span class="text-small">Số điện thoại chưa có trong hệ thống sẽ được tạo tự động.</span>-->
<!--          </el-alert>-->
<!--        </el-form-item>-->
<!--        <el-form-item prop="customerPhone">-->
<!--          <input-label label="SĐT khách hàng" optional/>-->
<!--          <el-input @keypress.enter.native="createOrder" v-model="form.customerPhone"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item>
          <el-button class="full-width" type="warning" @click="createOrder" :loading="isLoading">Tạo đơn
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
  import {mapState} from "vuex";
  import MessageUtils from "@/utils/message.util";
  import Constants from "@/utils/constants";

  export default {
    name: "CreateOrder",
    computed: {
      ...mapState({
        currentOrder: state => state.posMachine.currentOrder,
        selectedSeat: state => state.posMachine.selectedSeat,
      })
    },
    data() {
      return {
        seatPrefixUrl: Constants.CUSTOMER_UI_SEAT_PREFIX_URL,
        isLoading: false,
        form: {
          customerPhone: null,
        },
        formRules: {
          customerPhone: [
            {
              pattern: "^(09|03|07|08|05)+([0-9]{8})$",
              message: "Số điện thoại không hợp lệ",
              trigger: "blur"
            }
          ]
        },
      };
    },
    watch: {
      currentOrder: function () {
        if (!this.currentOrder.guid) this.resetForm();
      },
    },
    methods: {
      goto(seatGuid) {
        let routeData = this.seatPrefixUrl + seatGuid;
        window.open(routeData, '_blank', "width=360; height=640");
      },
      createOrder() {
        const vm = this;
        this.$refs.createOrderForm.validate(async valid => {
          if (valid) {
            // dont create customer here
            this.form.customerPhone = null;
            try {
              vm.isLoading = true;
              await this.$store.dispatch("posMachine/createOrder", this.form.customerPhone);
              vm.isLoading = false;
            } catch (error) {
              vm.isLoading = false;
              MessageUtils.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
            }
          }
        });
      },
      resetForm() {
        this.form = {};
      },
    }
  };
</script>

<style scoped>

</style>
