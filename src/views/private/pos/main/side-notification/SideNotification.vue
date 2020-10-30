<template>
  <el-container class="full-size" direction="vertical" v-loading="isLoading">
    <el-header class="padding-0-10 bg-yellowgreen" height="40px">
      <el-row class="full-size" type="flex" align="middle">
        <el-col>
          <el-tooltip>
            <div slot="content">
              <span>{{today | moment("DD/MM/YYYY")}}</span>
            </div>
            <el-badge :value="listUnseen.length" :hidden="!listUnseen.length">
              <el-button size="small" class="bg-yellowgreen no-border padding-right-15 padding-top-0 padding-bottom-0 padding-left-0">
                <span class="text-bold text-medium">{{notificationTitle}}</span>
              </el-button>
            </el-badge>
          </el-tooltip>
        </el-col>
        <el-col class="text-right">
          <el-tooltip content="Làm mới">
            <el-button size="mini" type="success" plain @click="reloadNotification" :loading="isLoading">
              <i class="el-icon-refresh"></i>
            </el-button>
          </el-tooltip>
          <el-dropdown trigger="click">
            <el-tooltip content="Tùy chọn">
              <el-button class="margin-left-10" size="mini" type="success" plain>
                <i class="el-icon-setting"></i>
              </el-button>
            </el-tooltip>
            <el-dropdown-menu class="padding-0" slot="dropdown">
              <el-dropdown-item @click.native="showHiddenNotification">
                <i class="el-icon-close-notification"></i>
                <span>Các thông báo đã ẩn</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </el-col>
      </el-row>
    </el-header>
    <el-main class="full-size show-vertical-scroll">
      <el-row class="full-size" type="flex" align="middle" justify="center" v-if="!listNotification.length">
        <span class="text-dark text-bold">Chưa có thông báo</span>
      </el-row>
      <template v-else>
        <el-dropdown-item class="padding-0" v-for="(notification) in listNotification" :key="notification.guid">
          <notification-item :notification="notification" :type="type"/>
        </el-dropdown-item>
      </template>
    </el-main>
    <el-footer height="auto">
      <el-row v-if="listNotification.length" class="bg-success text-light bottom-toolbar" type="flex" align="middle">
        <el-button @click="hideSeenNotification" type="danger" plain size="small"
                   class="full-width no-border-radius" style="border-left-width: 0; border-right-width: 0">
          <i class="fas el-icon-fa-eye-slash"></i>
          <span>Ẩn thông báo đã xem</span>
        </el-button>
      </el-row>
    </el-footer>
    <hidden-notification-dialog :type="type" ref="hiddenNotificationDialog"/>
  </el-container>
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
    name: 'SideNotification',
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
        allAreasObject: state => state.posMachine.allAreasObject
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
            listArea: Object.keys(this.allAreasObject).join(";"),
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
        try {
          this.isLoading = true;
          let listGuid = this.listSeen.map(item => item.guid);
          let payload = {
            storeGuid: this.$route.params.storeGuid,
            listGuid: listGuid,
            hidden: true,
          };
          await PosStoreNotificationService.toggleVisibility(payload);
        } catch (error) {
          ErrorUtils.showErrorMessage(error);
        } finally {
          this.isLoading = false;
        }
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
