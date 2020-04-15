<template>
  <el-container class="pos-container" direction="horizontal">
    <el-aside width="450px">
      <pos-sidebar class="pos-sidebar"/>
    </el-aside>
    <el-container class="pos-main-container" direction="vertical">
      <pos-header class="pos-header"/>
      <pos-main class="pos-main"/>
    </el-container>
  </el-container>
</template>

<script>
  import PosSidebar from "@/views/private/pos-machine/pos-sidebar/PosSidebar";
  import PosHeader from "@/views/private/pos-machine/pos-header/PosHeader";
  import PosMain from "@/views/private/pos-machine/pos-main/PosMain";

  export default {
    name: "PosMachineLayout",
    components: {PosMain, PosHeader, PosSidebar}
  };
</script>

<style scoped>
  .pos-container,
  .pos-main-container {
    height: 100%;
  }

  .pos-sidebar {
    background: #aaa;
    border-right: 1px solid yellowgreen;
  }

  .pos-header {
    background: #eee;
  }

  .pos-main {
    background: #f0f2f5 !important;
  }
</style>
