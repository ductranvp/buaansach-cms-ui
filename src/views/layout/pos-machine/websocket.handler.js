import NotificationUtils from "@/utils/notification.util";

const WebSocketHandler = {
  methods: {
    onMessageReceived(payload) {
      const data = JSON.parse(payload.body);
      const seatData = this.allSeats.find(seat => seat.guid === data.seatGuid);
      NotificationUtils.info(seatData.seatName + " " + seatData.areaName + " yêu cầu phục vụ");
    }
  }
};
export default WebSocketHandler;
