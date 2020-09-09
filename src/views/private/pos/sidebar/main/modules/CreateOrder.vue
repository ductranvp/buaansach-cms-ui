<template>
  <el-row class="full-size" type="flex" align="middle" justify="center">
    <el-col :span="10">
      <el-form onsubmit="return false" ref="createOrderForm" :model="form" :rules="formRules">
        <el-form-item>
          <el-row type="flex" align="middle" justify="center">
            <qrcode class="pointer" @click.native="goto(selectedSeat.guid)"
                    :value="seatPrefixUrl + selectedSeat.guid"></qrcode>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button class="full-width" type="warning" @click="createOrder" :loading="isLoading">
            <span>Tạo đơn</span>
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
              pattern: Constants.PHONE_REGEX,
              message: "Số điện thoại không hợp lệ",
              trigger: "blur"
            }
          ]
        },
      };
    },
    methods: {
      goto(seatGuid) {
        if (Constants.APP_MODE === 'prod') return;
        let routeData = this.seatPrefixUrl + seatGuid;
        window.open(routeData, '_blank', "width=400; height=640");
      },
      createOrder() {
        const vm = this;
        this.$refs.createOrderForm.validate(async valid => {
          if (valid) {
            try {
              vm.isLoading = true;
              await this.$store.dispatch("posMachine/createOrder");
            } catch (error) {
              console.log(error);
              const message = error.message || error.data.message;
              MessageUtils.error(message);
            } finally {
              vm.isLoading = false;
            }
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
