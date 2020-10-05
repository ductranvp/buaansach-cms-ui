<template>
  <el-row v-loading="isLoading" type="flex" align="middle"
          class="padding-5-10 notification-item"
          :class="notification.storeNotificationStatus === notificationStatus.UNSEEN ? 'unseen-notification' : ''">
    <el-col class="padding-right-10" @click.native="clickNotification(notification)">
      <div>
        <b>{{notification.title}}</b>
        <em v-if="type === notificationType.ORDER_UPDATE"> ({{notification.orderNotification.numberOfProduct }} loại sản
          phẩm)</em>
      </div>
      <el-row type="flex" align="middle">
        <el-col>
          <el-tooltip placement="top" :content="$moment(notification.createdDate).format('HH:mm:ss - DD/MM/YYYY')">
            <el-tag size="small" type="info">
              <i class="el-icon-time"></i>
              <span>{{notification.createdDate | moment('HH:mm:ss')}}</span>
            </el-tag>
          </el-tooltip>
          <el-tooltip placement="top" content="Người gọi" v-if="type === notificationType.ORDER_UPDATE">
            <el-tag class="margin-left-10" size="small" type="info">
              <i class="el-icon-s-claim"></i>
              <span v-if="notification.createdBy === 'anonymousUser'">Ẩn danh</span>
              <span v-else>{{notification.createdBy}}</span>
            </el-tag>
          </el-tooltip>
          <el-tooltip placement="top" content="Phương thức thanh toán" v-if="type === notificationType.PAY_REQUEST">
            <el-tag v-if="notification.payRequestNotification.storePayRequestMethod" class="margin-left-10" size="small" type="warning">
              <i class="el-icon-money"></i>
              <span>{{paymentMethod[notification.payRequestNotification.storePayRequestMethod]}}</span>
            </el-tag>
          </el-tooltip>
          <el-tooltip placement="top" content="Tiền khách sẽ đưa" v-if="type === notificationType.PAY_REQUEST">
            <el-tag class="margin-left-10" size="small" type="success">
              <i class="el-icon-money"></i>
              <span>{{notification.payRequestNotification.storePayRequestAmount | priceAppend}}</span>
            </el-tag>
          </el-tooltip>
        </el-col>
        <template v-if="!showUsername">
          <el-tooltip placement="top" v-if="notification.firstSeenBy"
                      :content="'Người xem đầu: ' + notification.firstSeenBy">
            <el-tag class="margin-left-10" size="small" type="info">
              <i class="fas el-icon-fa-eye margin-0"></i>
            </el-tag>
          </el-tooltip>
          <el-tooltip placement="top" v-if="notification.storeNotificationHidden && notification.firstHiddenBy"
                      :content="'Người ẩn đầu:' + notification.firstHiddenBy">
            <el-tag class="margin-left-10" size="small" type="info">
              <i class="fas el-icon-fa-eye-slash margin-0"></i>
            </el-tag>
          </el-tooltip>
        </template>
        <template v-else>
          <el-tooltip placement="top" v-if="notification.firstSeenBy" content="Người xem đầu">
            <el-tag class="margin-left-10" size="small" type="info">
              <i class="fas el-icon-fa-eye"></i>
              <span>{{notification.firstSeenBy}}</span>
            </el-tag>
          </el-tooltip>
          <el-tooltip placement="top" v-if="notification.storeNotificationHidden && notification.firstHiddenBy"
                      content="Người ẩn đầu">
            <el-tag class="margin-left-10" size="small" type="info">
              <i class="fas el-icon-fa-eye-slash"></i>
              <span>{{notification.firstHiddenBy}}</span>
            </el-tag>
          </el-tooltip>
        </template>
      </el-row>
    </el-col>
    <el-tooltip placement="top" content="Ẩn thông báo" v-if="!notification.storeNotificationHidden">
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
  import PaymentMethod from '@/enum/PaymentMethod';

  export default {
    name: 'NotificationItem',
    computed: {
      ...mapState({
        selectedSeat: state => state.posMachine.selectedSeat,
        currentStore: state => state.posMachine.currentStore,
      }),
    },
    props: {
      selectable: {
        type: Boolean,
        default: true,
      },
      showUsername: {
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
        paymentMethod: PaymentMethod.label,
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

        if (this.selectedSeat.guid !== notification.seatGuid) {
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
