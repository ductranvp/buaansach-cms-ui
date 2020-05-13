import NotificationUtils from "@/utils/notification.util";
import AuthUtils from "@/utils/auth.util";
import {Notification} from "element-ui";
import {mapState} from "vuex";

const WebSocketHandler = {
  computed: {
    ...mapState({
      stompClient: state => state.websocket.stompClient,
      currentStore: state => state.posMachine.currentStore
    })
  },
  data() {
    return {
      errorMessage: null,
      subscription: null,
    };
  },
  async created() {
    if (this.stompClient === null && AuthUtils.getToken())
      await this.$store.dispatch("websocket/connect", {
        onSuccess: this.onConnectSuccess,
        onError: this.onConnectError,
      });
  },
  methods: {
    scrollToEnd() {
      let container = document.querySelector(".scroll");
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    onConnectSuccess(stompClient) {
      if (this.errorMessage) {
        this.errorMessage.close();
        setTimeout(() => NotificationUtils.success("Kết nối lại thành công, tải lại trang để đảm bảo dữ liệu mới nhất"), 300);
      }
      const storeGuid = this.currentStore.guid || this.$route.params.storeGuid;
      this.subscription = stompClient.subscribe("/topic/pos/" + storeGuid, this.onMessageReceived);
    },
    onConnectError(error) {
      if (!this.errorMessage) {
        this.errorMessage = Notification.error({
          title: "Mất kết nối tới máy chủ!",
          message: "<span>Hãy kiểm tra các kết nối mạng!<br>Đang thực hiện kết nối lại...</span>",
          dangerouslyUseHTMLString: true,
          showClose: false,
          duration: 0
        });
      }
      if (this.subscription) {
        this.subscription.unsubscribe();
        this.subscription = null;
      }
    },
    async onMessageReceived(payload) {
      const data = JSON.parse(payload.body);
      const seatData = this.allSeats.find(seat => seat.guid === data.payload.seatGuid);
      switch (data.message) {
        case "GUEST_CREATE_ORDER":
          NotificationUtils.info(seatData.seatName + " " + seatData.areaName + " đã tạo đơn hàng");
          break;
        case "GUEST_UPDATE_ORDER":
          NotificationUtils.info(seatData.seatName + " " + seatData.areaName + " đã mọi món");
          break;
      }
      if (this.selectedSeat.guid === seatData.guid) {
        await this.$store.dispatch("posMachine/getSeatOrderInfo", seatData.guid);
        this.scrollToEnd();
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
