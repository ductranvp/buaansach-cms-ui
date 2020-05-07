<template>
  <el-main class="full-size">
    <el-container class="full-size" direction="vertical">
      <top-toolbar v-if="currentOrder.guid"/>
      <el-divider class="margin-0 bg-success" v-if="currentOrder.guid"></el-divider>
      <main-body/>
      <el-divider class="margin-0 bg-success" v-if="currentOrder.guid"></el-divider>
      <bottom-toolbar/>
      <el-divider class="margin-0 bg-success" v-if="currentOrder.guid"></el-divider>
    </el-container>
  </el-main>
</template>

<script>
  import TopToolbar from "@/views/private/pos-machine/sidebar/modules/main/TopToolbar";
  import MainBody from "@/views/private/pos-machine/sidebar/modules/main/MainBody";
  import BottomToolbar from "@/views/private/pos-machine/sidebar/modules/main/BottomToolbar";
  import {mapState} from "vuex";

  export default {
    name: "PosSidebarMain",
    components: {BottomToolbar, MainBody, TopToolbar},
    computed: {
      ...mapState({
        unsavedOrderProduct: state => state.posMachine.unsavedOrderProduct,
        currentOrder: state => state.posMachine.currentOrder,
      }),
    },
  };
</script>

<style scoped></style>
