import AuthUtils from "@/utils/auth.util";
import {mapState} from "vuex";
import NotificationUtils from "@/utils/notification.util";

const ManagerWebsocket = {
  computed: {
    ...mapState({
      managerStompClient: state => state.websocket.managerStompClient,
      managerSubscription: state => state.websocket.managerSubscription
    })
  },
  data() {
    return {
      errorMessage: null,
      subscription: null,
    };
  },
  async created() {
    if (this.managerStompClient === null && AuthUtils.getToken()) {
      await this.$store.dispatch("websocket/managerConnect", {
        onSuccess: this.onConnectSuccess,
        onError: this.onConnectError,
      });
    }
  },
  methods: {
    onConnectSuccess(stompClient) {
      if (!this.managerSubscription) {
        const subscription = stompClient.subscribe("/topic/manager", this.onMessageReceived);
        this.$store.commit("websocket/SET_MANAGER_SUBSCRIPTION", subscription);
      }
    },
    onConnectError(error) {

    },
    async onMessageReceived(payload) {
      const data = JSON.parse(payload.body);
      NotificationUtils.info("Số điện thoại " + data.payload + " đã đăng ký");
    }
  }
};
export default ManagerWebsocket;
