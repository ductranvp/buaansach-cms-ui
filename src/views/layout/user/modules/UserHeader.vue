<template>
  <el-header class="bg-success" height="50px">
    <el-row class="full-size padding-0-10" type="flex" align="middle">
      <el-col>
        <router-link to="/">
          <img src="/logo_square.png" class="logo">
        </router-link>
        <el-button class="padding-10" type="success" @click="goto('homePage')">
          <span>BỮA ĂN SẠCH</span>
        </el-button>
      </el-col>
      <el-col class="text-right">
        <el-button type="success" v-if="hasAnyRole(['ROLE_ADMIN'])" @click="goto('adminDashboardPage')">
          <span>Quản trị viên</span>
        </el-button>
        <el-button type="success" v-if="hasAnyRole(['ROLE_MANAGER'])" @click="goto('managerCustomerVoucherCodePage')">
          <span>Quản lý</span>
        </el-button>
        <el-button type="success" @click="goto('profilePage')">
          <span>Tài Khoản</span>
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
    width: 36px;
    height: 36px;
    vertical-align: middle;
  }
</style>
