<template>
  <el-dropdown :hide-on-click="false" trigger="click">
    <el-tooltip content="Thông báo">
      <el-badge :value="listUnseen.length" :hidden="!listUnseen.length">
        <el-button class="icon-button" type="success">
          <i class="el-icon-message-solid"></i>
        </el-button>
      </el-badge>
    </el-tooltip>
    <el-dropdown-menu class="padding-0 notification" slot="dropdown">
      <el-row class="bg-success text-light top-toolbar" type="flex" align="middle">
        <el-col>
          <el-button @click="markAllAsRead" type="success" class="full-width no-border-radius" size="medium">
            <i class="fas el-icon-fa-envelope-open"></i>
            <span>Đã xem tất cả</span>
          </el-button>
        </el-col>
        <el-col class="text-center">
          <el-checkbox v-model="deleteWhenClick">
            <span class="text-light">Xóa khi bấm xem</span>
          </el-checkbox>
        </el-col>
      </el-row>
      <el-dropdown-item v-if="!listNotification.length">
        <el-row type="flex" align="middle" justify="center" class="padding-50-10">
          <span>Chưa có thông báo</span>
        </el-row>
      </el-dropdown-item>
      <el-dropdown-item @click.native="clickNotification(noti)" v-else class="padding-0"
                        v-for="(noti, index) in listNotification" :key="index">
        <notification-item :data="noti"/>
      </el-dropdown-item>
      <el-row class="bg-success text-light bottom-toolbar" type="flex" align="middle">
        <el-col>
          <el-button @click="clearSeenNotifications" type="info" size="small" class="full-width no-border-radius">
            <i class="fas el-icon-fa-eraser"></i>
            <span>Xóa đã xem</span>
          </el-button>
        </el-col>
        <el-col>
          <el-button @click="clearAllNotification" type="info" size="small" class="full-width no-border-radius">
            <i class="fas el-icon-fa-trash-alt"></i>
            <span>Xóa tất cả</span>
          </el-button>
        </el-col>
      </el-row>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  import {mapState} from "vuex";
  import NotificationItem from "@/views/private/pos-machine/header/notification/NotificationItem";
  import MessageUtils from "@/utils/message.util";

  export default {
    name: "PosNotification",
    components: {NotificationItem},
    computed: {
      ...mapState({
        selectedSeat: state => state.posMachine.selectedSeat,
        currentStore: state => state.posMachine.currentStore,
        listNotification: state => state.posMachine.storeNotifications,
        allAreas: state => state.posMachine.allAreas,
        listUnseen: state => state.posMachine.storeNotifications.filter(item => item.status === 'UNSEEN'),
      })
    },
    data() {
      return {
        deleteWhenClick: false
      };
    },
    methods: {
      clickNotification(notification) {
        if (this.currentStore.storeStatus === 'CLOSED') {
          MessageUtils.error("Cửa hàng đã đóng cửa");
          return;
        }
        if (this.selectedSeat.guid !== notification.seat.guid) {
          this.$store.dispatch("posMachine/selectSeat", notification.seat);
        }
        this.$store.commit("posMachine/MARK_AS_READ", notification);
        if (this.deleteWhenClick) {
          this.$store.commit("posMachine/REMOVE_NOTIFICATION", notification);
        }
      },
      markAllAsRead() {
        this.$store.commit("posMachine/MARK_ALL_AS_READ");
      },
      clearSeenNotifications() {
        this.$store.commit("posMachine/CLEAR_SEEN_NOTIFICATION");
      },
      clearAllNotification() {
        this.$store.commit("posMachine/CLEAR_STORE_NOTIFICATIONS");
      }
    }
  };
</script>

<style scoped>
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
    border-radius: 0;
    border: none;
    position: relative;
    width: 300px;
    max-height: 500px;
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
    border-radius: 10px;
    background-color: #aaa;
  }

  .notification::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: #F5F5F5;
  }
</style>
