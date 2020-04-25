<template>
  <el-main class="full-size">
    <el-container class="full-size" direction="vertical">
      <top-toolbar/>
      <el-divider class="margin-0"></el-divider>
      <main-body/>
      <el-divider class="margin-0"></el-divider>
      <bottom-toolbar/>
    </el-container>
  </el-main>
</template>

<script>
  import TopToolbar from "@/views/private/pos-machine/sidebar/modules/main/TopToolbar";
  import MainBody from "@/views/private/pos-machine/sidebar/modules/main/MainBody";
  import BottomToolbar from "@/views/private/pos-machine/sidebar/modules/main/BottomToolbar";

  export default {
    name: "PosSidebarMain",
    components: {BottomToolbar, MainBody, TopToolbar},
    data() {
      return {};
    },
  };
</script>

<style scoped></style>
