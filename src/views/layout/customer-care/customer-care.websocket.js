import AuthUtils from "@/utils/auth.util";
import {mapState} from "vuex";

const CustomerCareWebsocket = {
  computed: {
    ...mapState({
      customerCareStompClient: state => state.websocket.customerCareStompClient,
      customerCareSubscription: state => state.websocket.customerCareSubscription
    })
  },
  async created() {
    if (this.customerCareStompClient === null && AuthUtils.getToken()) {
      await this.$store.dispatch("websocket/customerCareConnect", {
        onSuccess: this.onConnectSuccess,
        onError: this.onConnectError,
      });
    }
  },
  methods: {
    playAudio(){
      if (localStorage.getItem("muteCustomerSound") !== "yes"){
        let sound = document.getElementById("new_customer_sound");
        sound.play();
      }
    },
    onConnectSuccess(stompClient) {
      if (!this.customerCareSubscription) {
        const subscription = stompClient.subscribe("/topic/customer-care", this.onMessageReceived);
        this.$store.commit("websocket/SET_CUSTOMER_CARE_SUBSCRIPTION", subscription);
      }
    },
    onConnectError(error) {

    },
    async onMessageReceived(payload) {
      const data = JSON.parse(payload.body);
      const notify = {
        customerPhone: data.payload,
        status: "UNSEEN",
        createdDate: new Date()
      };
      this.$store.commit("customerCare/ADD_NEW_NOTIFICATION", notify);
      this.playAudio();
    }
  }
};
export default CustomerCareWebsocket;
