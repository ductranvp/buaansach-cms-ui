<template>
  <el-container direction="vertical" class="full-size">
    <pos-mobile-header/>
    <pos-mobile-main/>
    <pos-mobile-footer/>
  </el-container>
</template>

<script>
  import PosMobileHeader from '@/views/private/pos-mobile/PosMobileHeader';
  import PosMobileMain from '@/views/private/pos-mobile/PosMobileMain';
  import PosMobileFooter from '@/views/private/pos-mobile/PosMobileFooter';
  import NotificationUtils from '@/utils/notification.util';
  export default {
    name: 'PosMobileLayout',
    components: {PosMobileFooter, PosMobileMain, PosMobileHeader},
    async created() {
      try {
        await this.$store.dispatch('posMachine/initState', this.$route.params.storeGuid);
      } catch (e) {
        NotificationUtils.error('Lỗi khởi tạo dữ liệu, vui lòng tải lại trang.', 0);
      }
    },
  };
</script>

<style scoped>

</style>