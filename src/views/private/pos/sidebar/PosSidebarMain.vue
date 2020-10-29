<template>
  <el-main class="full-size">
    <el-container class="full-size" direction="vertical">
      <top-toolbar v-show="currentOrder.guid"/>
      <main-body-layout/>
      <el-divider class="margin-0 bg-success" v-if="currentOrder.guid"></el-divider>
      <bottom-toolbar/>
      <el-divider class="margin-0 bg-success" v-if="currentOrder.guid"></el-divider>
    </el-container>
  </el-main>
</template>

<script>
  import TopToolbar from '@/views/private/pos/sidebar/main/modules/TopToolbar';
  import MainBodyLayout from '@/views/private/pos/sidebar/main/MainBodyLayout';
  import BottomToolbar from '@/views/private/pos/sidebar/main/modules/BottomToolbar';
  import {mapState} from 'vuex';

  export default {
    name: 'PosSidebarMain',
    components: {BottomToolbar, MainBodyLayout, TopToolbar},
    computed: {
      ...mapState({
        currentOrder: state => state.posMachine.currentOrder,
      }),
    },
  };
</script>

<style scoped></style>
