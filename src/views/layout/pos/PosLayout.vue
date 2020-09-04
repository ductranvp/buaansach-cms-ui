<template>
  <el-container v-loading="!ready" class="full-size" direction="horizontal">
    <el-aside width="450px" class="aside">
      <pos-machine-sidebar v-loading="currentStore.storeStatus ==='CLOSED' || isLoadingOrder"/>
    </el-aside>
    <el-container class="full-size" direction="vertical">
      <pos-machine-header/>
      <pos-machine-main v-loading="currentStore.storeStatus ==='CLOSED'" class="hidden-sm-and-down"/>
    </el-container>
  </el-container>
</template>

<script>
  import PosMachineSidebar from "@/views/private/pos/PosMachineSidebar";
  import PosMachineHeader from "@/views/private/pos/PosMachineHeader";
  import PosMachineMain from "@/views/private/pos/PosMachineMain";
  import {mapState} from "vuex";
  import PosWebsocket from "@/views/layout/pos/pos.websocket";
  import MessageUtils from "@/utils/message.util";
  import NotificationUtils from "@/utils/notification.util";

  export default {
    name: "PosLayout",
    components: {PosMachineMain, PosMachineHeader, PosMachineSidebar},
    mixins: [PosWebsocket],
    computed: {
      ...mapState({
        ready: state => state.posMachine.ready,
        currentStore: state => state.posMachine.currentStore,
        isLoadingOrder: state => state.posMachine.isLoadingOrder,
      })
    },
    data() {
      return {askBeforeLeave: false};
    },
    mounted() {
      if (this.askBeforeLeave) {
        window.onbeforeunload = function (event) {
          event.returnValue = "ask before leave";
        };
      }
    },
    beforeDestroy() {
      window.onbeforeunload = null;
      this.$store.commit("posMachine/SET_STORE_ORDER_NOTIFICATIONS", []);
      this.$store.commit("posMachine/SET_STORE_PAY_REQUEST_NOTIFICATIONS", []);
      this.$store.dispatch("posMachine/clearSeat");
    },
    async created() {
      try {
        await this.$store.dispatch("posMachine/initState", this.$route.params.storeGuid);
      } catch (e) {
        NotificationUtils.error("Lỗi khởi tạo dữ liệu, vui lòng tải lại trang.", 0);
      }

      /* Lấy thông tin cộng dồn đơn */
      this.$store.dispatch("posMachine/getStoreOrderGroup", this.$route.params.storeGuid);

      /* Lấy thông tin gọi nhân viên */
      this.$store.dispatch("posMachine/getStoreCallWaiter", this.$route.params.storeGuid);

      let startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const payload = {
        storeGuid: this.$route.params.storeGuid,
        startDate: startDate,
        hidden: null // null means get all
      };
      /* Lấy thông báo gọi món */
      this.$store.dispatch("posMachine/getStoreOrderNotifications", payload);
      /* Lấy thông báo yêu cầu thanh toán */
      this.$store.dispatch("posMachine/getStorePayRequestNotifications", payload);

    }
  };
</script>

<style scoped>
  .pos-container,
  .pos-main-container {
    height: 100%;
  }

  .aside {
    background-color: #fff;
    overflow: hidden;
  }
</style>
