<template>
  <el-container class="container" direction="horizontal">
    <el-container class="main-container" direction="vertical">
      <CustomerCareHeader class="header"/>
      <CustomerCareMain class="main"/>
    </el-container>
    <CustomerCareSidebar class="sidebar"/>
  </el-container>
</template>

<script>
  import CustomerCareSidebar from "@/views/layout/customer-care/modules/CustomerCareSidebar";
  import CustomerCareHeader from "@/views/layout/customer-care/modules/CustomerCareHeader";
  import CustomerCareMain from "@/views/layout/customer-care/modules/CustomerCareMain";
  import CustomerCareWebsocket from "@/views/layout/customer-care/customer-care.websocket";

  export default {
    name: "CustomerCareLayout",
    mixins: [CustomerCareWebsocket],
    components: {CustomerCareMain, CustomerCareHeader, CustomerCareSidebar},
    created() {
    }
  };
</script>

<style scoped>
  .container,
  .main-container {
    height: 100%;
  }

  .sidebar {
    background: #aaa;
  }

  .header {
    background: #eee;
  }

  .main {
    background: #fff;
  }
</style>
