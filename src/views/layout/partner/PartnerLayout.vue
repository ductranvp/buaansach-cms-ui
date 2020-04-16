<template>
  <el-container class="partner-container" direction="horizontal">
    <PartnerSidebar class="partner-sidebar"/>
    <el-container class="partner-main-container" direction="vertical">
      <PartnerHeader class="partner-header"/>
      <PartnerMain class="partner-main"/>
    </el-container>
  </el-container>
</template>

<script>
  import PartnerSidebar from "@/views/layout/partner/modules/PartnerSidebar";
  import PartnerHeader from "@/views/layout/partner/modules/PartnerHeader";
  import PartnerMain from "@/views/layout/partner/modules/PartnerMain";

  export default {
    name: "PartnerLayout",
    components: {PartnerMain, PartnerHeader, PartnerSidebar},
    created() {
    }
  };
</script>

<style scoped>
  .partner-container,
  .partner-main-container {
    height: 100%;
  }

  .partner-sidebar {
    background: #aaa;
  }

  .partner-header {
    background: #eee;
  }

  .partner-main {
    background: #fff;
  }
</style>
