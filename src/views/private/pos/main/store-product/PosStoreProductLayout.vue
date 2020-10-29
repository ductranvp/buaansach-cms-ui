<template>
  <el-container class="full-size" direction="horizontal">
    <el-aside width="33%">
      <side-notification :type="notificationType.PAY_REQUEST"/>
    </el-aside>
    <el-divider direction="vertical" class="full-height bg-success margin-0"></el-divider>
    <el-main class="full-size">
      <pos-store-product/>
    </el-main>
  </el-container>
</template>

<script>

  import PosStoreProduct from '@/views/private/pos/main/store-product/PosStoreProduct';
  import SideNotification from '@/views/private/pos/main/side-notification/SideNotification';
  import StoreNotificationType from '@/enum/StoreNotificationType';

  export default {
    name: 'PosStoreProductLayout',
    components: {SideNotification, PosStoreProduct},
    data() {
      return {
        notificationType: StoreNotificationType.value,
      };
    },

  };
</script>

<style scoped>
</style>
