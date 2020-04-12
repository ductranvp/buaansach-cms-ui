<template>
  <el-header height="50px">
    <el-row
      class="full-size"
      type="flex"
      align="middle"
      justify="space-between"
    >
      <el-button class="text-24" @click="goHome">
        <i class="el-icon-s-home" />
        <span>Home</span>
      </el-button>
      <el-button @click="logout">
        <span>Logout</span>
      </el-button>
    </el-row>
  </el-header>
</template>

<script>
import AuthUtils from "@/utils/auth.util";

export default {
  name: "AdminHeader",
  methods: {
    goHome() {
      this.$router.push({ name: "homePage" });
    },
    logout() {
      AuthUtils.logout();
    }
  }
};
</script>

<style scoped></style>
