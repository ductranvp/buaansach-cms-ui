<template>
  <el-container class="full-size" direction="vertical">
    <el-row type="flex" align="middle" justify="center" class="full-size column">
      <h1>Bạn không có quyền truy cập trang này</h1>
      <el-button @click="()=>{this.$router.push('/home')}">Về trang chủ</el-button>
    </el-row>
  </el-container>
</template>

<script>
  export default {
    name: "Page403"
  };
</script>

<style scoped></style>
