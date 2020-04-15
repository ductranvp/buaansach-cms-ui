<template>
  <el-container class="user-container" direction="horizontal">
    <el-container class="user-main-container" direction="vertical">
      <UserHeader class="user-header"/>
      <UserMain class="user-main"/>
    </el-container>
  </el-container>
</template>

<script>
  import UserHeader from "@/views/layout/user/modules/UserHeader";
  import UserMain from "@/views/layout/user/modules/UserMain";

  export default {
    name: "UserLayout",
    components: {UserMain, UserHeader}
  };
</script>

<style scoped>
  .user-container,
  .user-main-container {
    height: 100%;
  }

  .user-sidebar {
    background: #aaa;
  }

  .user-header {
    background: #eee;
  }

  .user-main {
    background: #f0f2f5 !important;
  }
</style>
