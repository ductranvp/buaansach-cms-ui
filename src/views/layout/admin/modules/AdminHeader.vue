<template>
  <el-header height="50px">
    <el-row
      class="full-size"
      type="flex"
      align="middle"
      justify="space-between"
    >
      <el-button
        class="transparent-btn text-24"
        @click="
          () => {
            this.$router.push('/');
          }
        "
        ><i class="el-icon-s-home"
      /></el-button>
      <el-button @click="logout">
        Logout
      </el-button>
    </el-row>
  </el-header>
</template>

<script>
import AuthUtils from "@/utils/auth.util";

export default {
  name: "AdminHeader",
  methods: {
    logout() {
      AuthUtils.logout();
    }
  }
};
</script>

<style scoped></style>
