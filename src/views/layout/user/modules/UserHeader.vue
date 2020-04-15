<template>
  <el-header class="bg-success" height="60px">
    <el-row class="full-size padding-0-10" type="flex" align="middle">
      <el-col>
        <router-link to="/">
          <img src="../../../../assets/images/logo.jpg" class="logo">
        </router-link>
        <el-button type="success" @click="goto('homePage')">
          <span>BỮA ĂN SẠCH</span>
        </el-button>
      </el-col>
      <el-col class="text-right">
        <el-button type="success" v-if="hasAnyRole(['ROLE_ADMIN'])" @click="goto('adminDashboardPage')">
          <span>Quản trị viên</span>
        </el-button>
        <el-button type="success" @click="goto('logout')">
          <span>Đăng xuất</span>
        </el-button>
      </el-col>
    </el-row>
  </el-header>
</template>

<script>
  import AuthUtils from "@/utils/auth.util";
  import hasAnyRole from "@/utils/has-any-role";
  import MessageBoxUtils from "@/utils/message-box.util";

  export default {
    name: "UserHeader",
    methods: {
      goto(routeName) {
        if (routeName === "logout") {
          MessageBoxUtils.confirm("Thoát tài khoản", function () {
            AuthUtils.logout();
          });
        } else {
          this.$router.push({name: routeName}).catch(() => {
          });
        }
      },
      hasAnyRole: hasAnyRole,
    }
  };
</script>

<style scoped>
  .logo {
    border: 2px solid gray;
    width: 32px;
    height: 32px;
    vertical-align: middle;
  }
</style>
