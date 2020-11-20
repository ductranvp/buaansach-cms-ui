<template>
  <el-container v-loading="!ready" class="full-size" direction="horizontal">
    <el-aside width="30%" class="aside">
      <pos-machine-sidebar v-loading="currentStore.storeStatus === storeStatusValue.CLOSED || isLoadingOrder"/>
    </el-aside>
    <el-container class="full-size" direction="vertical">
      <pos-machine-header/>
      <pos-machine-main v-loading="currentStore.storeStatus === storeStatusValue.CLOSED"/>
    </el-container>
  </el-container>
</template>

<script>
  import PosMachineSidebar from '@/views/private/pos/PosMachineSidebar';
  import PosMachineHeader from '@/views/private/pos/PosMachineHeader';
  import PosMachineMain from '@/views/private/pos/PosMachineMain';
  import {mapState} from 'vuex';
  import PosWebsocket from '@/views/layout/pos/pos.websocket';
  import NotificationUtils from '@/utils/notification.util';
  import StoreStatus from '@/enum/StoreStatus';

  export default {
    name: 'PosLayout',
    components: {PosMachineMain, PosMachineHeader, PosMachineSidebar},
    mixins: [PosWebsocket],
    computed: {
      ...mapState({
        ready: state => state.posMachine.ready,
        currentStore: state => state.posMachine.currentStore,
        isLoadingOrder: state => state.posMachine.isLoadingOrder,
        allAreasObject: state => state.posMachine.allAreasObject
      }),
    },
    data() {
      return {
        askBeforeLeave: false,
        storeStatusValue: StoreStatus.value
      };
    },
    mounted() {
      if (this.askBeforeLeave) {
        window.onbeforeunload = function(event) {
          event.returnValue = 'ask before leave';
        };
      }
    },
    beforeDestroy() {
      window.onbeforeunload = null;
      this.$store.commit('posMachine/RESET_STORE_NOTIFICATION', []);
      this.$store.dispatch('posMachine/clearSeat');
    },
    async created() {
      try {
        await this.$store.dispatch('posMachine/initState', this.$route.params.storeGuid);
      } catch (e) {
        NotificationUtils.error('Lỗi khởi tạo dữ liệu, vui lòng tải lại trang.', 0);
        return;
      }
      /* Lấy thông báo  */
      this.$store.dispatch('posMachine/reloadAllStoreNotification');
    },
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
