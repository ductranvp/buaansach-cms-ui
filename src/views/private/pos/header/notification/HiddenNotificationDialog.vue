<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    :before-close="beforeClose"
    :destroy-on-close="true"
    :title="dialogTitle"
    :show-close="false"
  >
    <el-main>
      <el-row v-if="!listHiddenNotification.length">
        <el-alert class="padding-20" type="warning" :closable="false">
          <span class="text-large">Chưa có thông báo nào bị ẩn trong ngày hôm nay</span>
        </el-alert>
      </el-row>
      <template v-else>
        <el-row class="notification-item" v-for="item in listHiddenNotification" :key="item.guid">
          <notification-item :selectable="false" :notification="item" :show-full-info="true" :type="type"/>
        </el-row>
      </template>
    </el-main>
    <div slot="footer">
      <el-button @click="hide">
        <span>{{$t('common.entity.action.close')}}</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>

  import {mapState} from 'vuex';
  import StoreNotificationType from '@/enum/StoreNotificationType';
  import NotificationItem from '@/views/private/pos/header/notification/NotificationItem';

  export default {
    name: 'HiddenNotificationDialog',
    components: {NotificationItem},
    props: {
      type: {
        type: String,
        required: true,
      },
    },
    computed: {
      ...mapState({
        listHiddenNotification(state) {
          return this.getListHiddenNotificationByType(state);
        },
      }),
      dialogTitle() {
        switch (this.type) {
          case StoreNotificationType.value.CALL_WAITER:
            return 'Thông báo gọi nhân viên đã ẩn';
          case StoreNotificationType.value.PAY_REQUEST:
            return 'Thông báo gọi thanh toán đã ẩn';
          case StoreNotificationType.value.ORDER_UPDATE:
            return 'Thông báo gọi món đã ẩn';
          default:
            return 'Thông báo đã ẩn';
        }
      },
    },
    data() {
      return {
        isLoading: false,
        dialogFormVisible: false,
      };
    },
    methods: {
      show() {
        this.dialogFormVisible = true;
      },
      hide() {
        this.dialogFormVisible = false;
      },
      beforeClose(done) {
        done();
      },
      getListHiddenNotificationByType(state) {
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
        return notifications.filter(item => item.storeNotificationHidden);
      },
    },
  };
</script>

<style scoped>
  /deep/.notification-item i {
    margin-right: 5px;
  }
</style>
