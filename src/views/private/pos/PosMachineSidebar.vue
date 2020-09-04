<template>
  <el-container class="full-size pos-order-layout" direction="vertical">
    <pos-sidebar-header/>
    <pos-sidebar-main class="pos-oder-main"/>
    <pos-sidebar-footer/>
  </el-container>
</template>

<script>
  import PosSidebarMain from "@/views/private/pos/sidebar/PosSidebarMain";
  import PosSidebarHeader from "@/views/private/pos/sidebar/PosSidebarHeader";
  import PosSidebarFooter from "@/views/private/pos/sidebar/PosSidebarFooter";

  export default {
    name: "PosMachineSidebar",
    components: {PosSidebarFooter, PosSidebarHeader, PosSidebarMain},
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
