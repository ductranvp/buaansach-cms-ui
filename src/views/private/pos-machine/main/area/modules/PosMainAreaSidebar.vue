<template>
  <el-container class="full-size" direction="vertical">
    <el-header class="padding-0-10 bg-yellowgreen" height="36px">
      <el-row class="full-size" type="flex" align="middle">
        <span class="text-bold">Danh Sách Khu Vực</span>
      </el-row>
    </el-header>
    <el-main class="full-size">
      <el-row v-for="item in list" :key="item.$index">
        <p>{{item.name}}</p>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
  export default {
    name: "PosMainAreaSidebar",
    data() {
      const temp = {
        name: "duc tran"
      };
      return {
        list: Array(100).fill(temp)
      };
    }
  };
</script>

<style scoped>

</style>
