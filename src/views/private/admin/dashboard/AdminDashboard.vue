<template>
  <div>
  <el-button type="warning" @click="$router.push({name: 'qrCreatorPage'})">Tạo mã QR</el-button>
  </div>
</template>

<script>
  export default {
    name: "AdminDashboard",
    data() {
      return {};
    }
  };
</script>

<style scoped></style>
