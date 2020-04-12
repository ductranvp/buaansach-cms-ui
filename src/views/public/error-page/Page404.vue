<template>
  <el-container class="full-size" direction="vertical">
    <el-row type="flex" align="middle" justify="center" class="full-size column">
      <h1>Không tìm thấy trang bạn yêu cầu</h1>
      <el-button @click="()=>{this.$router.push('/home')}">Về trang chủ</el-button>
    </el-row>
  </el-container>
</template>

<script>
  export default {
    name: "Page404"
  };
</script>

<style scoped></style>
