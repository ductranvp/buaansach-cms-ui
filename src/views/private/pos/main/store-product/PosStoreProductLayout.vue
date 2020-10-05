<template>
  <el-container class="full-size" direction="horizontal">
    <el-main class="full-size">
      <pos-store-product/>
    </el-main>
    <el-divider direction="vertical" class="full-height bg-success margin-0"></el-divider>
    <el-aside width="168px">
      <pos-category/>
    </el-aside>
  </el-container>
</template>

<script>

  import PosStoreProduct from "@/views/private/pos/main/store-product/PosStoreProduct";
  import PosCategory from "@/views/private/pos/main/store-product/PosCategory";

  export default {
    name: "PosStoreProductLayout",
    components: {PosCategory, PosStoreProduct},

  };
</script>

<style scoped>
</style>
