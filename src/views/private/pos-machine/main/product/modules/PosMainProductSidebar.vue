<template>
  <el-container class="full-size">
    <el-header class="padding-0-10 bg-yellowgreen" height="36px">
      <el-row class="full-size" type="flex" align="middle">
        <span class="text-bold">Danh Mục Sản Phẩm</span>
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
    name: "PosMainProductSidebar",
    data() {
      const temp = {
        name: "San pham"
      };
      return {
        list: Array(100).fill(temp)
      };
    }
  };
</script>

<style scoped>

</style>
