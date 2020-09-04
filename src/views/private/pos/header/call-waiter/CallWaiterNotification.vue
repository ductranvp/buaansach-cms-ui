<template>
  <el-dropdown :hide-on-click="false" trigger="click">
    <el-tooltip content="Khách gọi">
      <el-badge :value="listUnseen.length" :hidden="!listUnseen.length">
        <el-button class="icon-button" type="success">
          <i class="el-icon-s-custom"></i>
        </el-button>
      </el-badge>
    </el-tooltip>
    <el-dropdown-menu class="padding-0 notification" slot="dropdown">
      <el-row class="bg-success text-light top-toolbar padding-5" type="flex" align="middle">
        <el-col class="padding-right-10 padding-top-5 padding-bottom-5">
          <span class="padding-right-10 text-bold">Thông báo gọi nhân viên</span>
        </el-col>
      </el-row>
      <el-dropdown-item v-if="!listNotification.length">
        <el-row type="flex" align="middle" justify="center" class="padding-50-10">
          <span>Chưa có thông báo nào</span>
        </el-row>
      </el-dropdown-item>
      <template v-else>
        <el-dropdown-item class="padding-0" v-for="(noti) in listNotification" :key="noti.guid">
          <call-waiter-item :notification="noti"/>
        </el-dropdown-item>
      </template>
      <el-row class="bg-success text-light bottom-toolbar" type="flex" align="middle">
        <el-col>
          <el-button @click="clearSeen" type="info" size="small" class="full-width no-border-radius">
            <i class="fas el-icon-fa-eraser"></i>
            <span>Xóa đã xem</span>
          </el-button>
        </el-col>
        <el-col>
          <el-button @click="clearAll" type="info" size="small" class="full-width no-border-radius">
            <i class="fas el-icon-fa-trash"></i>
            <span>Xóa tất cả</span>
          </el-button>
        </el-col>
      </el-row>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  import {mapState} from "vuex";
  import CallWaiterItem from "@/views/private/pos/header/call-waiter/CallWaiterItem";

  export default {
    name: "CallWaiterNotification",
    components: {CallWaiterItem},
    computed: {
      ...mapState({
        listNotification: state => state.posMachine.callWaiterNotifications,
        listUnseen: state => state.posMachine.callWaiterNotifications.filter(item => item.status === 'UNSEEN'),
        listSeen: state => state.posMachine.callWaiterNotifications.filter(item => item.status === 'SEEN'),
      })
    },
    methods: {
      clearSeen() {
        this.$store.commit("posMachine/CLEAR_SEEN_CALL_WAITER_NOTIFICATION");
      },
      clearAll() {
        this.$store.commit("posMachine/CLEAR_ALL_CALL_WAITER_NOTIFICATION");
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
