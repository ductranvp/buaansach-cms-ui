<template>
  <el-container class="full-size error-container bg-success" direction="vertical">
    <el-row type="flex" align="middle" justify="center" class="full-size column">
      <span class="error-code">403</span>
      <span class="error-description padding-20 text-center" v-if="!errorMessage">Thao tác của bạn đã bị chặn hoặc không có quyền truy cập.</span>
      <span class="error-description padding-20 text-center" v-else v-html="errorMessage"></span>
      <el-button type="warning" @click="pushRouteName('homePage')">Về trang chủ</el-button>
    </el-row>
  </el-container>
</template>

<script>
  export default {
    name: "Page403",
    data() {
      return {
        errorMessage: this.$route.params.errorMessage ? this.$route.params.errorMessage : null
      };
    }
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
