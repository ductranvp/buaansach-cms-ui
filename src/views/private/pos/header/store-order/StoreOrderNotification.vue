<template>
  <el-dropdown :hide-on-click="false" trigger="click">
    <el-tooltip content="Thông báo gọi món">
      <el-badge :value="listUnseen.length" :hidden="!listUnseen.length">
        <el-button class="icon-button" type="success">
          <i class="el-icon-message-solid"></i>
        </el-button>
      </el-badge>
    </el-tooltip>
    <el-dropdown-menu class="padding-0 notification" slot="dropdown" v-loading="isLoading">
      <el-row class="bg-success text-light top-toolbar padding-5" type="flex" align="middle">
        <el-col class="padding-right-10">
          <span class="padding-right-10 text-bold">Thông báo gọi món ({{today | moment("DD/MM/YYYY")}})</span>
        </el-col>
        <el-button size="mini" type="warning" @click="reloadNotification">Làm mới</el-button>
      </el-row>
      <el-dropdown-item v-if="!listNotification.length">
        <el-row type="flex" align="middle" justify="center" class="padding-50-10">
          <span>Chưa có thông báo nào</span>
        </el-row>
      </el-dropdown-item>
      <template v-else>
        <el-dropdown-item class="padding-0" v-for="(noti) in listNotification" :key="noti.guid">
          <store-order-notification-item :notification="noti"/>
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
    <hidden-store-order-notification-dialog ref="hiddenNotificationDialog"/>
  </el-dropdown>
</template>

<script>
  import {mapState} from "vuex";
  import StoreOrderNotificationItem from "@/views/private/pos/header/store-order/StoreOrderNotificationItem";
  import HiddenStoreOrderNotificationDialog from "@/views/private/pos/header/store-order/HiddenStoreOrderNotificationDialog";
  import PosStoreOrderService from "@/service/pos/pos.store-order.service";
  import MessageUtils from "@/utils/message.util";

  export default {
    name: "StoreOrderNotification",
    components: {HiddenStoreOrderNotificationDialog, StoreOrderNotificationItem},
    computed: {
      ...mapState({
        listNotification: state => state.posMachine.storeOrderNotifications.filter(item => !item.hidden),
        listUnseen: state => state.posMachine.storeOrderNotifications.filter(item => !item.hidden && item.storeOrderStatus === 'UNSEEN'),
        listSeen: state => state.posMachine.storeOrderNotifications.filter(item => !item.hidden && item.storeOrderStatus === 'SEEN'),
      })
    },
    data() {
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      return {
        today: today,
        isLoading: false,
        showHidden: false
      };
    },
    methods: {
      async reloadNotification() {
        try {
          this.isLoading = true;
          let startDate = new Date();
          startDate.setHours(0, 0, 0, 0);
          await this.$store.dispatch("posMachine/getStoreOrderNotifications", {
            storeGuid: this.$route.params.storeGuid,
            startDate: startDate,
            hidden: null,
          });
          this.isLoading = false;
        } catch (e) {
          this.isLoading = false;
          MessageUtils.error("Lỗi tải thông báo");
        }
      },
      async hideSeenNotification() {
        let listGuid = this.listSeen.map(item => item.guid);
        let payload = {
          storeGuid: this.$route.params.storeGuid,
          listGuid: listGuid,
          hidden: true
        };
        await PosStoreOrderService.toggleVisibility(payload);
        this.reloadNotification();
      },
      showHiddenNotification() {
        this.$refs.hiddenNotificationDialog.show();
      }
    }
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
