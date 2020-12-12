<template>
  <el-main class="full-size" v-loading="isLoadingOrder">
    <el-row
      v-if="!selectedSeat.guid"
      class="full-size"
      type="flex"
      align="middle"
      justify="center"
    >
      <div class="text-very-large text-bold text-warning">CHỌN 1 BÀN ĂN</div>
    </el-row>

    <el-container v-else class="full-size">
      <el-header height="auto" class="padding-top-20">
        <div class="text-center text-bold text-very-large">
          <span>{{ selectedSeat.seatName }}</span>
          <span> - </span>
          <span>{{ selectedSeat.areaName }}</span>
        </div>
        <div class="text-center">
          <em v-if="selectedSeat.seatStatus === seatStatus.EMPTY">Bàn trống</em>
          <em v-else>Đang dùng</em>
        </div>
      </el-header>

      <el-main class="full-size">
        <el-row class="full-size" type="flex" align="middle" justify="center">
          <qr-code
            v-if="selectedSeat.orderGuid"
            :size="350"
            :text="
              seatPrefixUrl +
                selectedSeat.guid +
                '?' +
                seatResumeParam +
                '=' +
                selectedSeat.orderGuid
            "
            :config="qrConfig"
          />
          <qr-code
            v-else
            :size="350"
            :text="seatPrefixUrl + selectedSeat.guid"
            :config="qrConfig"
          />
        </el-row>
      </el-main>
      <!--      <el-footer height="auto" class="padding-bottom-20">-->
      <!--        <el-row type="flex" justify="center" align="middle">-->
      <!--          <el-button-->
      <!--            @click="goto(selectedSeat.guid, currentOrder.guid)"-->
      <!--            type="warning"-->
      <!--            >Mở liên kết trong QR</el-button-->
      <!--          >-->
      <!--        </el-row>-->
      <!--      </el-footer>-->
    </el-container>
  </el-main>
</template>

<script>
import { mapState } from "vuex";
import Constants from "@/utils/constants";
import SeatStatus from "@/enum/SeatStatus";
import QrCode from "@/components/qr-code/QRCode";
import QrCodeUtils from "@/utils/qrcode.util";

export default {
  name: "PosMobileMain",
  components: { QrCode },
  computed: {
    ...mapState({
      selectedSeat: state => state.posMachine.selectedSeat,
      currentOrder: state => state.posMachine.currentOrder,
      currentStore: state => state.posMachine.currentStore,
      isLoadingOrder: state => state.posMachine.isLoadingOrder
    })
  },
  data() {
    return {
      seatPrefixUrl: Constants.CUSTOMER_UI_SEAT_PREFIX_URL,
      seatResumeParam: Constants.CUSTOMER_UI_SEAT_RESUME_PARAM,
      seatStatus: SeatStatus.value,
      qrConfig: QrCodeUtils.colorConfig()
    };
  },
  methods: {
    goto(seatGuid, orderGuid) {
      if (Constants.APP_MODE === "prod") return;
      let routeData = this.seatPrefixUrl + seatGuid;
      if (orderGuid) {
        routeData += "?resume=" + orderGuid;
      }
      window.open(routeData, "_blank", "width=400; height=640");
    }
  }
};
</script>

<style scoped></style>
