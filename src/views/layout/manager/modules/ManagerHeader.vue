<template>
  <el-header height="50px" class="bg-success padding-0-10">
    <el-row
      class="full-size"
      type="flex"
      align="middle"
      justify="space-between"
    >
      <el-col>
        <router-link to="/">
          <img src="/logo_square.png" class="bas-logo">
        </router-link>
        <el-button class="padding-10" type="success" @click="goto('homePage')">
          <span>BỮA ĂN SẠCH</span>
        </el-button>
      </el-col>
      <el-button type="success" size="small" @click="goto('logout')">
        Đăng xuất
      </el-button>
    </el-row>
  </el-header>
</template>

<script>
  import AuthUtils from "@/utils/auth.util";
  import MessageBoxUtils from "@/utils/message-box.util";
  import hasAnyRole from "@/utils/has-any-role";

  export default {
    name: "ManagerHeader",
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

<style scoped></style>
