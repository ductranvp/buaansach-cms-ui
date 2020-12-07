<template>
  <el-row class="full-size" type="flex" align="middle" justify="center">
    <el-col :span="10">
      <el-form
        onsubmit="return false"
        ref="createOrderForm"
        :model="form"
        :rules="formRules"
      >
        <el-form-item>
          <el-row type="flex" align="middle" justify="center">
            <qr-code
              class="pointer"
              :size="150"
              @click.native="goto(selectedSeat.guid)"
              :text="seatPrefixUrl + selectedSeat.guid"
            />
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
            class="full-width"
            type="warning"
            @click="createOrder"
            :loading="isLoading"
          >
            <span>Tạo đơn</span>
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import { mapState } from "vuex";
import Constants from "@/utils/constants";
import ErrorUtils from "@/utils/error.util";
import QrCode from "@/components/qr-code/QRCode";

export default {
  name: "CreateOrder",
  components: { QrCode },
  computed: {
    ...mapState({
      currentOrder: state => state.posMachine.currentOrder,
      selectedSeat: state => state.posMachine.selectedSeat
    })
  },
  data() {
    return {
      seatPrefixUrl: Constants.CUSTOMER_UI_SEAT_PREFIX_URL,
      isLoading: false,
      form: {
        customerPhone: null
      },
      formRules: {
        // customerPhone: [
        //   {
        //     pattern: Constants.PHONE_REGEX,
        //     message: "Số điện thoại không hợp lệ",
        //     trigger: "blur"
        //   }
        // ]
      }
    };
  },
  methods: {
    goto(seatGuid) {
      if (Constants.APP_MODE === "prod") return;
      let routeData = this.seatPrefixUrl + seatGuid;
      window.open(routeData, "_blank", "width=400; height=640");
    },
    createOrder() {
      const vm = this;
      this.$refs.createOrderForm.validate(async valid => {
        if (valid) {
          try {
            vm.isLoading = true;
            await this.$store.dispatch("posMachine/createOrder");
          } catch (error) {
            ErrorUtils.showActionErrorMessage(error);
          } finally {
            vm.isLoading = false;
          }
        }
      });
    }
  }
};
</script>

<style scoped></style>
