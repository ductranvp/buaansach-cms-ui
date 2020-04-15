<template>
  <el-container class="full-size pos-order-layout" direction="vertical">
    <pos-order-header/>
    <pos-order-main class="pos-oder-main"/>
    <pos-order-footer/>
  </el-container>
</template>

<script>
  import PosOrderMain from "@/views/private/pos-machine/pos-sidebar/modules/PosOrderMain";
  import PosOrderHeader from "@/views/private/pos-machine/pos-sidebar/modules/PosOrderHeader";
  import PosOrderFooter from "@/views/private/pos-machine/pos-sidebar/modules/PosOrderFooter";

  export default {
    name: "PosSidebar",
    components: {PosOrderFooter, PosOrderHeader, PosOrderMain},
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
