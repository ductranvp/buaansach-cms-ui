<template>
  <el-container class="public-container" direction="vertical">
    <PublicHeader class="public-header" />
    <PublicMain class="public-main" />
    <PublicFooter class="public-footer" />
  </el-container>
</template>

<script>
import PublicHeader from "@/views/layout/public/modules/PublicHeader";
import PublicMain from "@/views/layout/public/modules/PublicMain";
import PublicFooter from "@/views/layout/public/modules/PublicFooter";
export default {
  name: "PublicLayout",
  components: { PublicFooter, PublicMain, PublicHeader }
};
</script>

<style scoped>
.public-container {
  height: 100%;
}
.public-header {
  background: #eee;
}
.public-main {
  background: #fff;
  overflow-x: hidden !important;
}
.public-footer {
  background: #ddd;
}
</style>
