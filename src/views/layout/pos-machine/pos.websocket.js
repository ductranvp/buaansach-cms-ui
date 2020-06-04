import AuthUtils from "@/utils/auth.util";
import {mapState} from "vuex";
import MessageUtils from "@/utils/message.util";

const PosWebsocket = {
  computed: {
    ...mapState({
      posStompClient: state => state.websocket.posStompClient,
      currentStore: state => state.posMachine.currentStore,
      posSubscription: state => state.websocket.posSubscription,
      selectedSeat: state => state.posMachine.selectedSeat,
      allAreas: state => state.posMachine.allAreas,
      allSeats: state => {
        let arr = [];
        state.posMachine.allAreas.forEach(area => {
          arr = arr.concat(area.listSeat);
        });
        return arr;
      }
    })
  },
  async created() {
    if (this.posStompClient === null && AuthUtils.getToken()) {
      await this.$store.dispatch("websocket/posConnect", {
        onSuccess: this.onConnectSuccess,
        onError: this.onConnectError,
      });
    }
  },
  methods: {
    scrollToEnd() {
      let container = document.querySelector(".scroll");
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    onConnectSuccess(stompClient) {
      if (!this.posSubscription) {
        const storeGuid = this.currentStore.guid || this.$route.params.storeGuid;
        const subscription = stompClient.subscribe("/topic/pos/" + storeGuid, this.onMessageReceived);
        this.$store.commit("websocket/SET_POS_SUBSCRIPTION", subscription);
      }
    },
    onConnectError(error) {

    },
    async onMessageReceived(payload) {
      const data = JSON.parse(payload.body);
      const seatData = this.allSeats.find(seat => seat.guid === data.payload);
      const id = (new Date()).getTime() + "" + seatData.guid;
      const notification = {
        id: id,
        title: "Gọi món",
        content: seatData.seatName + " " + seatData.areaName + " đã mọi món",
        time: new Date(),
        status: "UNSEEN",
        watched: false,
        seat: seatData
      };

      switch (data.message) {
        case "GUEST_CREATE_ORDER":
          // NotificationUtils.info(seatData.seatName + " " + seatData.areaName + " đã tạo đơn hàng");
          break;
        case "GUEST_UPDATE_ORDER":
          this.$store.commit("posMachine/ADD_NOTIFICATION", notification);
          MessageUtils.info(seatData.seatName + " " + seatData.areaName + " đã gọi món");
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
export default PosWebsocket;
