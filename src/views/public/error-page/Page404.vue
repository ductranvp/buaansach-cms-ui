<template>
  <el-container class="full-size error-container bg-success" direction="vertical">
    <el-row type="flex" align="middle" justify="center" class="full-size column">
      <span class="error-code">404</span>
      <span class="error-description padding-20">Không tìm thấy trang bạn yêu cầu</span>
      <el-button type="warning" @click="pushRouteName('homePage')">Về trang chủ</el-button>
    </el-row>
  </el-container>
</template>

<script>
  export default {
    name: "Page404"
  };
</script>

<style scoped>
  .error-code {
    font-size: 64px;
    margin: 0;
    color: #fff;
    font-weight: 900
  }

  .error-description {
    font-size: 24px;
    color: #fff;
  }

  .error-container {
    min-height: 100%;
    width: 100%;
    background-color: #2d3a4b;
    overflow: hidden;
  }
</style>
