<template>
  <el-dropdown :hide-on-click="false" trigger="click">
    <!--Icon-->
    <el-tooltip :content="notificationTitle">
      <el-badge :value="listUnseen.length" :hidden="!listUnseen.length">
        <el-button class="icon-button" type="success">
          <i :class="iconClass"></i>
        </el-button>
      </el-badge>
    </el-tooltip>
    <!--Main-->
    <el-dropdown-menu class="padding-0 notification" slot="dropdown" v-loading="isLoading">
      <el-row class="bg-success text-light top-toolbar padding-5" type="flex" align="middle">
        <el-col class="padding-right-10">
          <span class="padding-right-10 text-bold">{{notificationTitle}} ({{today | moment('DD/MM/YYYY')}})</span>
        </el-col>
        <el-button size="mini" type="warning" @click="reloadNotification">Làm mới</el-button>
      </el-row>
      <el-dropdown-item v-if="!listNotification.length">
        <el-row type="flex" align="middle" justify="center" class="padding-50-10">
          <span>Chưa có thông báo nào</span>
        </el-row>
      </el-dropdown-item>
      <template v-else>
        <el-dropdown-item class="padding-0" v-for="(notification) in listNotification" :key="notification.guid">
          <notification-item :notification="notification" :type="type"/>
        </el-dropdown-item>
      </template>
      <el-row class="bg-success text-light bottom-toolbar" type="flex" align="middle">
        <el-col>
          <el-button @click="hideSeenNotification" type="info" size="small" class="full-width no-border-radius">
            <i class="fas el-icon-fa-eye-slash"></i>
            <span>Ẩn thông báo đã xem</span>
          </el-button>
        </el-col>
        <el-col>
          <el-button @click="showHiddenNotification" type="info" size="small" class="full-width no-border-radius">
            <i class="fas el-icon-fa-eye"></i>
            <span>Các thông báo đã ẩn</span>
          </el-button>
        </el-col>
      </el-row>
    </el-dropdown-menu>
    <hidden-notification-dialog :type="type" ref="hiddenNotificationDialog"/>
  </el-dropdown>
</template>

<script>
  import {mapState} from 'vuex';
  import HiddenNotificationDialog from '@/views/private/pos/header/notification/HiddenNotificationDialog';
  import StoreNotificationType from '@/enum/StoreNotificationType';
  import NotificationItem from '@/views/private/pos/header/notification/NotificationItem';
  import StoreNotificationStatus from '@/enum/StoreNotificationStatus';
  import PosStoreNotificationService from '@/service/pos/pos.store-notification.service';
  import ErrorUtils from '@/utils/error.util';

  export default {
    name: 'Notification',
    components: {NotificationItem, HiddenNotificationDialog},
    props: {
      type: {
        type: String,
        required: true,
      },
    },
    computed: {
      ...mapState({
        listNotification(state) {
          return this.getListNotificationByType(state);
        },
        listSeen(state) {
          return this.getListNotificationByType(state).
            filter(item => item.storeNotificationStatus === StoreNotificationStatus.value.SEEN);
        },
        listUnseen(state) {
          return this.getListNotificationByType(state).
            filter(item => item.storeNotificationStatus === StoreNotificationStatus.value.UNSEEN);
        },
      }),
      notificationTitle() {
        switch (this.type) {
          case StoreNotificationType.value.CALL_WAITER:
            return 'Gọi nhân viên';
          case StoreNotificationType.value.PAY_REQUEST:
            return 'Gọi thanh toán';
          case StoreNotificationType.value.ORDER_UPDATE:
            return 'Gọi món';
          default:
            return 'Thông báo';
        }
      },
      iconClass() {
        switch (this.type) {
          case StoreNotificationType.value.CALL_WAITER:
            return 'el-icon-s-custom';
          case StoreNotificationType.value.PAY_REQUEST:
            return 'el-icon-money';
          case StoreNotificationType.value.ORDER_UPDATE:
            return 'el-icon-message-solid';
          default:
            return '';
        }
      },
    },
    data() {
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      return {
        today: today,
        isLoading: false,
      };
    },
    methods: {
      getListNotificationByType(state) {
        let notifications = [];
        switch (this.type) {
          case StoreNotificationType.value.CALL_WAITER:
            notifications = state.posMachine.callWaiterNotifications;
            break;
          case StoreNotificationType.value.PAY_REQUEST:
            notifications = state.posMachine.payRequestNotifications;
            break;
          case StoreNotificationType.value.ORDER_UPDATE:
            notifications = state.posMachine.orderNotifications;
            break;
        }
        return notifications.filter(item => !item.storeNotificationHidden);
      },
      async reloadNotification() {
        try {
          this.isLoading = true;
          let startDate = new Date();
          startDate.setHours(0, 0, 0, 0);
          await this.$store.dispatch('posMachine/getStoreNotifications', {
            storeGuid: this.$route.params.storeGuid,
            startDate: startDate,
            type: this.type,
            hidden: null,
          });
        } catch (error) {
          ErrorUtils.showErrorMessage(error, 'Lỗi tải thông báo');
        } finally {
          this.isLoading = false;
        }
      },
      async hideSeenNotification() {
        let listGuid = this.listSeen.map(item => item.guid);
        let payload = {
          storeGuid: this.$route.params.storeGuid,
          listGuid: listGuid,
          hidden: true,
        };
        await PosStoreNotificationService.toggleVisibility(payload);
        this.reloadNotification();
      },
      showHiddenNotification() {
        this.$refs.hiddenNotificationDialog.show();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .el-menu {
    border-right-width: 0;
  }

  .top-toolbar {
    z-index: 100;
    position: sticky;
    left: 0;
    top: 0;
  }

  .bottom-toolbar {
    z-index: 100;
    position: sticky;
    left: 0;
    bottom: 0;
  }

  .icon-button {
    padding: 0;
    height: 32px;
    width: 32px;
    font-size: 22px
  }

  .notification {
    border: none;
    border-radius: 0;
    box-shadow: 0 3px 8px rgba(0, 0, 0, .25);
    position: relative;
    width: 380px;
    max-height: 480px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0;
  }

  /deep/ .el-badge__content.is-fixed {
    top: 8px;
    right: 8px;
  }

  .notification::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  .notification::-webkit-scrollbar-thumb {
    /*border-radius: 10px;*/
    background-color: #aaa;
  }

  .notification::-webkit-scrollbar-track {
    /*border-radius: 10px;*/
    background-color: #F5F5F5;
  }
</style>
