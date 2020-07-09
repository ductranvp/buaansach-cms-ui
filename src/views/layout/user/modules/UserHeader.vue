<template>
  <el-header class="bg-success" height="50px">
    <el-row class="full-size padding-0-10" type="flex" align="middle">
      <el-row type="flex" align="middle">
        <router-link to="/">
          <img src="/logo_square.png" class="logo">
        </router-link>
        <el-button class="padding-10" type="success" @click="goto('homePage')">
          <span class="hidden-xs-only">BỮA ĂN SẠCH</span>
        </el-button>
      </el-row>
      <el-col class="text-right">
        <el-button type="success" v-if="hasAnyRole(['ROLE_ADMIN'])" @click="goto('adminDashboardPage')">
          <i class="el-icon-s-tools"></i>
          <span class="hidden-sm-and-down">Quản trị viên</span>
        </el-button>
        <el-button type="success" v-if="hasAnyRole(['ROLE_CUSTOMER_CARE'])" @click="goto('customerCareDashboardPage')">
          <i class="fas el-icon-fa-comment"></i>
          <span class="hidden-sm-and-down">Chăm sóc khách hàng</span>
        </el-button>
        <el-button type="success" @click="goto('profilePage')">
          <i class="el-icon-user-solid"></i>
          <span class="hidden-sm-and-down">Tài Khoản</span>
        </el-button>
        <el-button type="success" @click="goto('logout')">
          <i class="fas el-icon-fa-sign-out-alt"></i>
          <span class="hidden-sm-and-down">Đăng xuất</span>
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
