<template>
  <el-container v-loading="isLoadingSeatOrder" class="full-size pos-order-layout" direction="vertical">
    <pos-sidebar-header/>
    <pos-sidebar-main class="pos-oder-main"/>
    <pos-sidebar-footer/>
  </el-container>
</template>

<script>
  import PosSidebarMain from "@/views/private/pos-machine/sidebar/modules/PosSidebarMain";
  import PosSidebarHeader from "@/views/private/pos-machine/sidebar/modules/PosSidebarHeader";
  import PosSidebarFooter from "@/views/private/pos-machine/sidebar/modules/PosSidebarFooter";
  import {mapState} from "vuex";

  export default {
    name: "PosMachineSidebar",
    components: {PosSidebarFooter, PosSidebarHeader, PosSidebarMain},
    computed: {
      ...mapState({
        isLoadingSeatOrder: state => state.posMachine.isLoadingSeatOrder
      }),
    },
    data() {
      return {};
    }
  };
</script>

<style scoped>
  .pos-oder-main {
    background: #f0f2f5 !important;
  }

</style>
