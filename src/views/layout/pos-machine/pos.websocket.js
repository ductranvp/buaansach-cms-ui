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
    playAudio(){
      if (localStorage.getItem("muteSound") !== "yes"){
        let sound = document.getElementById("notification_sound");
        sound.play();
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
        case "GUEST_CREATE_ORDER":
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
        case "GUEST_UPDATE_ORDER":
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
