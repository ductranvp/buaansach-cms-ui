import NotificationUtils from "@/utils/notification.util";

const WebSocketHandler = {
  watch: {
    stompClient: function (val) {
      if (this.stompClient)
        this.stompClient.subscribe("/topic/pos/" + this.$route.params.storeGuid, this.onMessageReceived);
    }
  },
  methods: {
    onMessageReceived(payload) {
      const data = JSON.parse(payload.body);
      const seatData = this.allSeats.find(seat => seat.guid === data.seatGuid);
      NotificationUtils.info(seatData.seatName + " " + seatData.areaName + " đã tạo đơn hàng");
      if (this.selectedSeat.guid === seatData.guid) {
        this.$store.dispatch("posMachine/getSeatOrderInfo", seatData.guid);
      } else {
        this.$store.commit("posMachine/CHANGE_SEAT_STATUS", {
          targetSeat: seatData,
          seatStatus: "NON_EMPTY",
          seatServiceStatus: "UNFINISHED"
        });
      }
    }
  }
};
export default WebSocketHandler;
