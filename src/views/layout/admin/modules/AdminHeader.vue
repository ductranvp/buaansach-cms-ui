<template>
  <el-header height="50px">
    <el-row class="full-size padding-right-10 padding-left-10" type="flex" align="middle">
      <hamburger :is-active="!adminSidebarCollapse" @toggleClick="toggleSidebar"/>
      <el-col class="text-right">
        <el-button size="medium" type="primary" plain @click="goto('logout')">
          <span>Đăng xuất</span>
        </el-button>
      </el-col>
    </el-row>
  </el-header>
</template>

<script>
  import AuthUtils from "@/utils/auth.util";
  import {mapState} from "vuex";
  import Hamburger from "@/components/hamburger/index";
  import MessageBoxUtils from "@/utils/message-box.util";

  export default {
    name: "AdminHeader",
    components: {Hamburger},
    computed: {
      ...mapState({
        adminSidebarCollapse: state => state.app.adminSidebarCollapse
      })
    },
    methods: {
      toggleSidebar() {
        this.$store.commit("app/TOGGLE_ADMIN_SIDEBAR");
      },
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
    }
  };
</script>

<style scoped></style>
