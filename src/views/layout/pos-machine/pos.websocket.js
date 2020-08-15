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
      maxRetry: 30
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
    playAudio(elementId){
      if (localStorage.getItem("muteSound") !== "yes") {
        let sound = document.getElementById(elementId);
        if (sound && sound.paused) {
          sound.play();
        }
      }
    },
    onMessageReceived(payload) {
      const data = JSON.parse(payload.body);
      const seatData = this.allSeats[data.payload.seatGuid];
      const updateOrder = {
        ...data.payload,
        title: seatData.seatName + " - " + seatData.areaName,
        seat: seatData
      };

      const callWaiter = {
        id: data.payload.seatGuid + (new Date()).getTime(),
        title: seatData.seatName + " - " + seatData.areaName,
        createdDate: new Date(),
        status: "UNSEEN"
      };

      const payRequest = {
        ...data.payload,
        title: seatData.seatName + " - " + seatData.areaName,
        seat: seatData
      };

      switch (data.message) {
        case WebSocketConstants.GUEST_CALL_WAITER:
          this.$store.commit("posMachine/ADD_CALL_WAITER_NOTIFICATION", callWaiter);
          MessageUtils.warning(callWaiter.title);
          this.playAudio("call_waiter_sound");
          break;
        case WebSocketConstants.GUEST_STORE_PAY_REQUEST:
          this.$store.commit("posMachine/ADD_STORE_PAY_REQUEST_NOTIFICATION", payRequest);
          MessageUtils.warning(payRequest.title);
          reloadSeatIfActive(this);
          this.playAudio("store_pay_request_sound");
          break;
        case WebSocketConstants.GUEST_CREATE_ORDER:
          handleSeatChange(this);
          break;
        case WebSocketConstants.POS_UPDATE_ORDER:
          this.$store.commit("posMachine/ADD_STORE_ORDER_NOTIFICATION", updateOrder);
          break;
        case WebSocketConstants.GUEST_UPDATE_ORDER:
          handleSeatChange(this);
          this.$store.commit("posMachine/ADD_STORE_ORDER_NOTIFICATION", updateOrder);
          MessageUtils.info(updateOrder.title);
          this.playAudio("store_order_sound");
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

      function reloadSeatIfActive(vm) {
        if (vm.selectedSeat.guid === seatData.guid) {
          vm.$store.dispatch("posMachine/getSeatOrderInfo", seatData.guid).then(() => {
            vm.scrollToEnd();
          });
        }
      }

    }
  }
};
export default PosWebsocket;
