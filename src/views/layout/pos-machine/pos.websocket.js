import {mapState} from "vuex";
import MessageUtils from "@/utils/message.util";
import WebSocketConstants from "@/store/websocket/websocket.constants";

const PosWebsocket = {
  computed: {
    ...mapState({
      wsStompClient: state => state.websocket.wsStompClient,
      wsConnected: state => state.websocket.wsConnected,
      currentStore: state => state.posMachine.currentStore,
      selectedSeat: state => state.posMachine.selectedSeat,
      allAreas: state => state.posMachine.allAreas,
      allSeats: state => {
        let arr = {};
        state.posMachine.allAreas.forEach(area => {
          area.listSeat.forEach(seat => {
            arr[seat.guid] = seat;
          });
        });
        return arr;
      }
    })
  },
  data() {
    return {
      subscription: null,
      retry: 0,
      maxRetry: 60
    };
  },
  watch: {
    wsConnected: function (val) {
      if (val) {
        if (this.subscription) {
          this.unsubscribeTopics();
          this.subscribeTopics();
        }
      }
    }
  },
  async created() {
    this.subscribeTopics();
  },
  beforeDestroy() {
    this.unsubscribeTopics();
  },
  methods: {
    subscribeTopics() {
      try {
        const storeGuid = this.$route.params.storeGuid;
        this.subscription = this.wsStompClient.subscribe(WebSocketConstants.TOPIC_POS_PREFIX + storeGuid, this.onMessageReceived);
      } catch (e) {
        this.retry++;
        if (this.retry < this.maxRetry) {
          setTimeout(() => {
            this.subscribeTopics();
          }, 1000);
        } else {
          MessageUtils.error("Không thể đăng ký nhận thông báo gọi món. Hãy thử tải lại trang.");
        }
      }
    },
    unsubscribeTopics() {
      if (this.subscription) {
        this.subscription.unsubscribe();
        this.subscription = null;
      }
    },
    scrollToEnd() {
      let container = document.querySelector(".scroll");
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    playAudio() {
      if (localStorage.getItem("muteSound") !== "yes") {
        let sound = document.getElementById("notification_sound");
        if (sound) sound.play();
      }
    },
    onMessageReceived(payload) {
      const data = JSON.parse(payload.body);
      const seatData = this.allSeats[data.payload];
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
        case WebSocketConstants.GUEST_CREATE_ORDER:
          if (this.selectedSeat.guid === seatData.guid) {
            this.$store.dispatch("posMachine/getSeatOrderInfo", seatData.guid).then(() => {
              this.scrollToEnd();
            });
          } else {
            this.$store.commit("posMachine/CHANGE_SEAT_STATUS", {
              targetSeat: seatData,
              seatStatus: "NON_EMPTY",
              seatServiceStatus: "UNFINISHED"
            });
          }
          break;
        case WebSocketConstants.GUEST_UPDATE_ORDER:
          if (this.selectedSeat.guid === seatData.guid) {
            this.$store.dispatch("posMachine/getSeatOrderInfo", seatData.guid).then(() => {
              this.scrollToEnd();
            });
          } else {
            this.$store.commit("posMachine/CHANGE_SEAT_STATUS", {
              targetSeat: seatData,
              seatStatus: "NON_EMPTY",
              seatServiceStatus: "UNFINISHED"
            });
          }
          this.$store.commit("posMachine/ADD_NOTIFICATION", notification);
          MessageUtils.info(seatData.seatName + " " + seatData.areaName + " đã gọi món");
          this.playAudio();
          break;
      }
    }
  }
};
export default PosWebsocket;
