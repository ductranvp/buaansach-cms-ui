import {mapState} from "vuex";
import MessageUtils from "@/utils/message.util";
import WebSocketConstants from "@/store/websocket/websocket.constants";

const CustomerCareWebsocket = {
  computed: {
    ...mapState({
      wsStompClient: state => state.websocket.wsStompClient,
      wsConnected: state => state.websocket.wsConnected,
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
        this.subscription = this.wsStompClient.subscribe(WebSocketConstants.TOPIC_CUSTOMER_CARE_TRACKER, this.onMessageReceived);
      } catch (e) {
        this.retry++;
        if (this.retry < this.maxRetry) {
          setTimeout(() => {
            this.subscribeTopics();
          }, 1000);
        } else {
          MessageUtils.error("Không thể đăng ký kênh nhận thông báo. Hãy thử tải lại trang.");
        }
      }
    },
    unsubscribeTopics() {
      if (this.subscription) {
        this.subscription.unsubscribe();
        this.subscription = null;
      }
    },
    playAudio() {
      if (localStorage.getItem("muteCustomerSound") !== "yes") {
        let sound = document.getElementById("new_customer_sound");
        if (sound) sound.play();
      }
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
    },
  }
};
export default CustomerCareWebsocket;
