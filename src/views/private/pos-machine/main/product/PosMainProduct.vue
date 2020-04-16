<template>
  <el-container class="full-size" direction="horizontal">
    <el-main class="full-size">
      <pos-main-product-main/>
    </el-main>
    <el-divider direction="vertical" class="full-height bg-success margin-0"></el-divider>
    <el-aside width="200px">
      <pos-main-product-sidebar/>
    </el-aside>
  </el-container>
</template>

<script>

  import PosMainProductMain from "@/views/private/pos-machine/main/product/modules/PosMainProductMain";
  import PosMainProductSidebar from "@/views/private/pos-machine/main/product/modules/PosMainProductSidebar";

  export default {
    name: "PosMainProduct",
    components: {PosMainProductSidebar, PosMainProductMain},

  };
</script>

<style scoped>
</style>
