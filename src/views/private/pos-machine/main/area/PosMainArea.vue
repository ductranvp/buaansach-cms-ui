<template>
  <el-container class="full-size" direction="horizontal">
    <el-main class="full-size">
      <pos-main-area-main/>
    </el-main>
    <el-divider direction="vertical" class="full-height bg-success margin-0"></el-divider>
    <el-aside width="200px">
      <pos-main-area-sidebar/>
    </el-aside>
  </el-container>
</template>

<script>
  import PosMainAreaMain from "@/views/private/pos-machine/main/area/modules/PosMainAreaMain";
  import PosMainAreaSidebar from "@/views/private/pos-machine/main/area/modules/PosMainAreaSidebar";

  export default {
    name: "PosMainArea",
    components: {PosMainAreaSidebar, PosMainAreaMain},
    created(){

    }
  };
</script>

<style scoped>
</style>
