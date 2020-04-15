<template>
  <el-header class="bg-success" height="60px">
    <el-row class="full-size padding-0-10" type="flex" align="middle" justify="center">
      <el-input placeholder="Nhập tên hoặc mã sản phẩm">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </el-row>
  </el-header>
</template>

<script>
    export default {
        name: "PosOrderHeader"
    };
</script>

<style scoped>

</style>
