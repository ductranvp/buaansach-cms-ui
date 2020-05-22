<template>
  <el-container class="container" direction="horizontal">
    <el-container class="main-container" direction="vertical">
      <CustomerCareHeader @show-sidebar="toggleSidebar" class="header"/>
      <CustomerCareMain class="main"/>
    </el-container>
    <CustomerCareSidebar v-if="showSidebar" class="sidebar"/>
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
    },
    data() {
      return {
        showSidebar: false,
      };
    },
    methods: {
      toggleSidebar(value) {
        this.showSidebar = value;
      }
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
