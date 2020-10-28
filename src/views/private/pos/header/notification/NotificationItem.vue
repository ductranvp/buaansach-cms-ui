<template>
  <el-row v-loading="isLoading" type="flex" align="middle"
          class="padding-5-10 notification-item"
          :class="[
            notification.storeNotificationStatus === notificationStatus.UNSEEN ? 'unseen-notification' : ''
          ]">
    <el-col class="padding-right-10" @click.native="clickNotification(notification)">
      <order-update-item :notification="notification" :show-full-info="showFullInfo"
                         v-if="type === notificationType.ORDER_UPDATE"/>
      <pay-request-item :notification="notification" :show-full-info="showFullInfo"
                        v-else-if="type === notificationType.PAY_REQUEST"/>
      <call-waiter-item :notification="notification" :show-full-info="showFullInfo"
                        v-else-if="type === notificationType.CALL_WAITER"/>
    </el-col>
    <el-tooltip placement="right" content="Ẩn thông báo" v-if="!notification.storeNotificationHidden">
      <el-button @click="toggleNotification(notification, true)" type="text"
                 class="text-info text-very-large">
        <i class="el-icon-close"></i>
      </el-button>
    </el-tooltip>
    <el-tooltip placement="top" v-else content="Hiện lại thông báo">
      <el-button @click="toggleNotification(notification, false)" type="text"
                 class="text-info text-very-large">
        <i class="el-icon-refresh-right"></i>
      </el-button>
    </el-tooltip>
  </el-row>
</template>

<script>
  import MessageUtils from '@/utils/message.util';
  import {mapState} from 'vuex';
  import StoreNotificationStatus from '@/enum/StoreNotificationStatus';
  import StoreNotificationType from '@/enum/StoreNotificationType';
  import PosStoreNotificationService from '@/service/pos/pos.store-notification.service';
  import StoreStatus from '@/enum/StoreStatus';
  import OrderUpdateItem from '@/views/private/pos/header/notification/item/OrderUpdateItem';
  import PayRequestItem from '@/views/private/pos/header/notification/item/PayRequestItem';
  import CallWaiterItem from '@/views/private/pos/header/notification/item/CallWaiterItem';

  export default {
    name: 'NotificationItem',
    components: {CallWaiterItem, PayRequestItem, OrderUpdateItem},
    computed: {
      ...mapState({
        selectedSeat: state => state.posMachine.selectedSeat,
        currentStore: state => state.posMachine.currentStore,
        activeOrderProductGroup: state => state.posMachine.activeOrderProductGroup,
      }),
    },
    props: {
      selectable: {
        type: Boolean,
        default: true,
      },
      showFullInfo: {
        type: Boolean,
        default: false,
      },
      notification: {
        type: Object,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        notificationStatus: StoreNotificationStatus.value,
        notificationType: StoreNotificationType.value,
        isLoading: false,
      };
    },
    methods: {
      async clickNotification(notification) {
        if (!this.selectable) return;
        if (this.currentStore.storeStatus === StoreStatus.value.CLOSED) {
          MessageUtils.error('Cửa hàng đã đóng cửa');
          return;
        }

        if (this.selectedSeat.guid !== notification.seatGuid && this.type !== this.notificationType.CALL_WAITER) {
          await this.$store.dispatch('posMachine/selectSeat', notification.seatGuid);
        }

        if (notification.storeNotificationStatus !== StoreNotificationStatus.value.SEEN) {
          this.markAsRead(notification);
        }

        if (this.type === this.notificationType.ORDER_UPDATE) {
          this.$store.commit('posMachine/SET_ACTIVE_ORDER_PRODUCT_GROUP',
            notification.orderNotification.orderProductGroup);
        }
      },
      async markAsRead(notification) {
        let payload = {
          guid: notification.guid,
          storeNotificationStatus: StoreNotificationStatus.value.SEEN,
        };
        try {
          this.isLoading = true;
          const {data} = await PosStoreNotificationService.updateStoreNotification(payload);
          notification.storeNotificationStatus = data.storeNotificationStatus;
          notification.firstSeenBy = data.firstSeenBy;
        } finally {
          this.isLoading = false;
        }
      },
      async toggleNotification(notification, hidden) {
        let payload = {
          storeGuid: this.$route.params.storeGuid,
          listGuid: [notification.guid],
          hidden: hidden,
        };
        try {
          this.isLoading = true;
          await PosStoreNotificationService.toggleVisibility(payload);
          notification.storeNotificationHidden = hidden;
        } finally {
          this.isLoading = false;
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .notification-item {
    line-height: 24px;
    border-bottom: 1px solid #bbb
  }

  .unseen-notification {
    background-color: $--color-warning-light;
  }

  .notification-item i {
    margin-right: 5px;
  }
</style>
