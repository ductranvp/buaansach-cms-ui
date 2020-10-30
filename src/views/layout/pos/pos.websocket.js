import {mapState} from 'vuex';
import MessageUtils from '@/utils/message.util';
import SeatStatus from '@/enum/SeatStatus';
import SeatServiceStatus from '@/enum/SeatServiceStatus';
import StorageKey from '@/utils/storage-key';
import WebsocketEndpoints from '@/utils/websocket.endpoints';
import WebsocketMessages from '@/utils/websocket.messages';

const PosWebsocket = {
  computed: {
    ...mapState({
      wsStompClient: state => state.websocket.wsStompClient,
      wsConnected: state => state.websocket.wsConnected,
      currentStore: state => state.posMachine.currentStore,
      selectedSeat: state => state.posMachine.selectedSeat,
      allSeatsObject: state => state.posMachine.allSeatsObject,
      allAreasObject: state => state.posMachine.allAreasObject,
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
        const storeGuid = this.$route.params.storeGuid;
        this.subscription = this.wsStompClient.subscribe(WebsocketEndpoints.TOPIC_POS_PREFIX + storeGuid,
          this.onMessageReceived);
      } catch (e) {
        this.retry++;
        if (this.retry < this.maxRetry) {
          setTimeout(() => {
            this.subscribeTopics();
          }, 1000);
        } else {
          MessageUtils.error('Không thể đăng ký nhận thông báo gọi món. Hãy thử tải lại trang.');
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
      let container = document.querySelector('.scroll');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    playAudio(elementId) {
      if (localStorage.getItem(StorageKey.localStorageKeys.MUTE_SOUND) !== 'yes') {
        let sound = document.getElementById(elementId);
        if (sound && sound.paused) {
          sound.play();
        }
      }
    },
    onMessageReceived(payload) {
      const data = JSON.parse(payload.body);
      const seatData = this.allSeatsObject[data.payload.seatGuid];

      /* Neu khu vuc khong thuoc phu trach cua user hien tai => Se khong tong tai vi tri nay */
      if (!seatData) return;

      const notification = {
        ...data.payload,
        title: seatData.seatName + ' - ' + seatData.areaName,
      };

      switch (data.message) {
        case WebsocketMessages.GUEST_CALL_WAITER:
          this.$store.commit('posMachine/ADD_CALL_WAITER_NOTIFICATION', notification);
          MessageUtils.info(notification.title + ' đã gọi nhân viên.');
          this.playAudio('call_waiter_sound');
          break;
        case WebsocketMessages.GUEST_STORE_PAY_REQUEST:
          this.$store.commit('posMachine/ADD_PAY_REQUEST_NOTIFICATION', notification);
          reloadSeatIfActive(this);
          MessageUtils.info(notification.title + ' yêu cầu thanh toán.');
          this.playAudio('store_pay_request_sound');
          break;
        case WebsocketMessages.GUEST_CREATE_ORDER:
          handleSeatChange(this);
          break;
        case WebsocketMessages.POS_UPDATE_ORDER:
          this.$store.commit('posMachine/ADD_ORDER_NOTIFICATION', notification);
          break;
        case WebsocketMessages.GUEST_UPDATE_ORDER:
          handleSeatChange(this);
          this.$store.commit('posMachine/ADD_ORDER_NOTIFICATION', notification);
          MessageUtils.info(notification.title + ' đã gọi món.');
          this.playAudio('store_order_sound');
          break;
        case WebsocketMessages.GUEST_UPDATE_POINT:
          reloadSeatIfActive(this);
          if (this.selectedSeat.guid === seatData.guid)
          MessageUtils.info(notification.title + ' đã cập nhật điểm thưởng.');
          break;
        case WebsocketMessages.GUEST_UPDATE_PHONE:
          reloadSeatIfActive(this);
          if (this.selectedSeat.guid === seatData.guid)
          MessageUtils.info(notification.title + ' đã cập nhật số điện thoại.');
          break;
      }

      function reloadSeatIfActive(vm) {
        if (vm.selectedSeat.guid !== seatData.guid) return;
        vm.$store.dispatch('posMachine/getSeatOrderInfo', seatData.guid).then(() => {
          vm.scrollToEnd();
        });
      }

      function handleSeatChange(vm) {
        if (vm.selectedSeat.guid === seatData.guid) {
          vm.$store.dispatch('posMachine/getSeatOrderInfo', seatData.guid).then(() => {
            vm.scrollToEnd();
          });
        } else {
          vm.$store.commit('posMachine/CHANGE_SEAT_STATUS', {
            targetSeat: seatData,
            seatStatus: SeatStatus.value.NON_EMPTY,
            seatServiceStatus: SeatServiceStatus.value.UNFINISHED,
          });
        }
      }

    },
  },
};
export default PosWebsocket;
