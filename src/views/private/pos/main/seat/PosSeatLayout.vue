<template>
  <el-container class="full-size" direction="horizontal">
    <el-aside width="31%">
      <side-notification :type="notificationType.ORDER_UPDATE"/>
    </el-aside>
    <el-divider direction="vertical" class="full-height bg-success margin-0"></el-divider>
    <el-main class="full-size">
      <pos-seat/>
    </el-main>
  </el-container>
</template>

<script>
  import PosSeat from '@/views/private/pos/main/seat/PosSeat';
  import SideNotification from '@/views/private/pos/main/side-notification/SideNotification';
  import StoreNotificationType from '@/enum/StoreNotificationType';

  export default {
    name: 'PosSeatLayout',
    components: {SideNotification, PosSeat},
    data() {
      return {
        notificationType: StoreNotificationType.value,
      };
    },
    created() {

    },
  };
</script>

<style scoped>
</style>
