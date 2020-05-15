<template>
  <el-container class="manager-container" direction="horizontal">
    <el-container class="manager-main-container" direction="vertical">
      <ManagerHeader class="manager-header"/>
      <ManagerMain class="manager-main"/>
    </el-container>
    <ManagerSidebar class="manager-sidebar"/>
  </el-container>
</template>

<script>
  import ManagerSidebar from "@/views/layout/manager/modules/ManagerSidebar";
  import ManagerHeader from "@/views/layout/manager/modules/ManagerHeader";
  import ManagerMain from "@/views/layout/manager/modules/ManagerMain";
  import ManagerWebsocket from "@/views/layout/manager/manager.websocket";

  export default {
    name: "ManagerLayout",
    mixins: [ManagerWebsocket],
    components: {ManagerMain, ManagerHeader, ManagerSidebar},
    created() {
    }
  };
</script>

<style scoped>
  .manager-container,
  .manager-main-container {
    height: 100%;
  }

  .manager-sidebar {
    background: #aaa;
  }

  .manager-header {
    background: #eee;
  }

  .manager-main {
    background: #fff;
  }
</style>
