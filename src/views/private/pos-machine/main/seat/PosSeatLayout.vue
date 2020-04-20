<template>
  <el-container class="full-size" direction="horizontal">
    <el-main class="full-size">
      <pos-seat/>
    </el-main>
    <el-divider direction="vertical" class="full-height bg-success margin-0"></el-divider>
    <el-aside width="168px">
      <pos-area/>
    </el-aside>
  </el-container>
</template>

<script>
  import PosSeat from "@/views/private/pos-machine/main/seat/PosSeat";
  import PosArea from "@/views/private/pos-machine/main/seat/PosArea";

  export default {
    name: "PosSeatLayout",
    components: {PosArea, PosSeat},
    created() {

    }
  };
</script>

<style scoped>
</style>
