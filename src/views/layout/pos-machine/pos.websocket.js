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
        if (sound && sound.paused) {
          sound.play();
        }
      }
    },
    playCallWaiterSound() {
      if (localStorage.getItem("muteSound") !== "yes") {
        let sound = document.getElementById("call_waiter_sound");
        if (sound && sound.paused) {
          sound.play();
        }
      }
    },
    onMessageReceived(payload) {
      const data = JSON.parse(payload.body);
      const seatData = this.allSeats[data.payload.seatGuid];
      const notification = {
        ...data.payload,
        title: seatData.seatName + " - " + seatData.areaName + " đã gọi món.",
        seat: seatData
      };

      const callWaiter = {
        id: data.payload.seatGuid + (new Date()).getTime(),
        title: seatData.seatName + " - " + seatData.areaName + " đã gọi nhân viên.",
        createdDate: new Date(),
        status: "UNSEEN"
      };

      switch (data.message) {
        case WebSocketConstants.GUEST_CALL_WAITER:
          this.$store.commit("posMachine/ADD_CALL_WAITER", callWaiter);
          MessageUtils.warning(callWaiter.title);
          this.playCallWaiterSound();
          break;
        case WebSocketConstants.GUEST_CREATE_ORDER:
          handleSeatChange(this);
          break;
        case WebSocketConstants.POS_UPDATE_ORDER:
          this.$store.commit("posMachine/ADD_NOTIFICATION", notification);
          break;
        case WebSocketConstants.GUEST_UPDATE_ORDER:
          handleSeatChange(this);
          this.$store.commit("posMachine/ADD_NOTIFICATION", notification);
          MessageUtils.info(notification.title);
          this.playAudio();
          break;
      }

      function handleSeatChange(vm) {
        if (vm.selectedSeat.guid === seatData.guid) {
          vm.$store.dispatch("posMachine/getSeatOrderInfo", seatData.guid).then(() => {
            vm.scrollToEnd();
          });
        } else {
          vm.$store.commit("posMachine/CHANGE_SEAT_STATUS", {
            targetSeat: seatData,
            seatStatus: "NON_EMPTY",
            seatServiceStatus: "UNFINISHED"
          });
        }
      }

    }
  }
};
export default PosWebsocket;
