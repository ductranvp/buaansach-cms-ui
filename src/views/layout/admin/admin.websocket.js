import {mapState} from 'vuex';
import MessageUtils from '@/utils/message.util';
import WebsocketStatus from '@/enum/WebsocketStatus';
import WebsocketEndpoints from '@/utils/websocket.endpoints';

const AdminWebsocket = {
  computed: {
    ...mapState({
      wsStompClient: state => state.websocket.wsStompClient,
      wsConnected: state => state.websocket.wsConnected,
    }),
  },
  data() {
    return {
      subscription: null,
      retry: 0,
      maxRetry: 30,
    };
  },
  watch: {
    wsConnected: function(val) {
      if (val) {
        if (this.subscription) {
          this.unsubscribeTopics();
          this.subscribeTopics();
        }
      }
    },
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
        this.subscription = this.wsStompClient.subscribe(WebsocketEndpoints.TOPIC_ADMIN_TRACKER,
          this.onTrackerEventReceived);
        this.$store.dispatch('adminStore/getActiveUsers');
      } catch (e) {
        this.retry++;
        if (this.retry < this.maxRetry) {
          setTimeout(() => {
            this.subscribeTopics();
          }, 1000);
        } else {
          MessageUtils.error('Không thể đăng ký kênh nhận thông báo. Hãy thử tải lại trang.', 0);
        }
      }
    },
    unsubscribeTopics() {
      if (this.subscription) {
        this.subscription.unsubscribe();
        this.subscription = null;
      }
    },
    onTrackerEventReceived(payload) {
      const data = JSON.parse(payload.body);
      data.vm = this;
      if (data.status === WebsocketStatus.value.CONNECTED) {
        this.$store.commit('adminStore/ADD_USER_SESSION', data);
      } else {
        this.$store.commit('adminStore/REMOVE_USER_SESSION', data);
      }
    },
  },
};
export default AdminWebsocket;
