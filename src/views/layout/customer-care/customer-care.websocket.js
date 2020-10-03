import {mapState} from 'vuex';
import MessageUtils from '@/utils/message.util';
import WebsocketEndpoints from '@/utils/websocket.endpoints';
import WebsocketMessages from '@/utils/websocket.messages';

const CustomerCareWebsocket = {
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
        this.subscription = this.wsStompClient.subscribe(WebsocketEndpoints.TOPIC_CUSTOMER_CARE_TRACKER,
          this.onMessageReceived);
      } catch (e) {
        this.retry++;
        if (this.retry < this.maxRetry) {
          setTimeout(() => {
            this.subscribeTopics();
          }, 1000);
        } else {
          MessageUtils.error('Không thể đăng ký kênh nhận thông báo. Hãy thử tải lại trang.');
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
      if (sessionStorage.getItem('muteCustomerSound') !== 'yes') {
        let sound = document.getElementById('new_customer_sound');
        if (sound && sound.paused) {
          sound.play();
        }
      }
    },
    async onMessageReceived(payload) {
      const data = JSON.parse(payload.body);
      let notificationType = ''; // NEW_CUSTOMER, CUSTOMER_PURCHASE
      let message = '';
      switch (data.message) {
        case WebsocketMessages.POS_CREATE_CUSTOMER:
          notificationType = 'NEW_CUSTOMER';
          message = ' đã đăng ký';
          break;
        case WebsocketMessages.GUEST_CREATE_CUSTOMER:
          notificationType = 'NEW_CUSTOMER';
          message = ' đã đăng ký';
          break;
        case WebsocketMessages.POS_PURCHASE_ORDER_WITH_PHONE:
          notificationType = 'CUSTOMER_PURCHASE';
          message = ' đã thanh toán';
          break;
        default:
          break;
      }
      const notify = {
        id: data.payload + '' + (new Date()).getTime(),
        customerPhone: data.payload,
        status: 'UNSEEN',
        message: message,
        type: notificationType,
        createdDate: new Date(),
      };
      this.$store.commit('customerCare/ADD_NEW_NOTIFICATION', notify);
      if (notificationType === 'NEW_CUSTOMER') this.playAudio();
    },
  },
};
export default CustomerCareWebsocket;
