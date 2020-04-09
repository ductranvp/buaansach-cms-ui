<template>
  <el-header>
    <el-row
      class="full-size"
      type="flex"
      align="middle"
      justify="space-between"
    >
      <p>EmployeeHeader</p>
      <el-button @click="logout">
        Logout
      </el-button>
    </el-row>
  </el-header>
</template>

<script>
import AuthUtils from "@/utils/auth.util";

export default {
  name: "EmployeeHeader",
  data() {
    return {};
  },
  methods: {
    logout() {
      AuthUtils.logout();
    }
  }
};
</script>

<style scoped></style>
