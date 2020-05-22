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
          <span class="hidden-sm-and-down">BỮA ĂN SẠCH</span>
        </el-button>
      </el-col>
      <el-button type="success" size="medium" @click="goto('logout')">
        <i class="fas el-icon-fa-sign-out-alt"></i>
        <span class="hidden-xs-only">Đăng xuất</span>
      </el-button>
      <div v-if="!showSidebar" class="padding-right-20">
        <el-badge :hidden="listUnseen.length === 0" :value="listUnseen.length" class="item">
          <el-button @click="toggleSidebar" class="padding-5" size="medium" type="success">
            <i class="el-icon-message-solid"></i>
            <span class="hidden-xs-only">Thông báo</span>
          </el-button>
        </el-badge>
      </div>
      <hamburger :is-active="!showSidebar" @toggleClick="toggleSidebar"/>
    </el-row>
  </el-header>
</template>

<script>
  import AuthUtils from "@/utils/auth.util";
  import MessageBoxUtils from "@/utils/message-box.util";
  import hasAnyRole from "@/utils/has-any-role";
  import Hamburger from "@/components/hamburger/index";
  import {mapState} from "vuex";

  export default {
    name: "CustomerCareHeader",
    components: {Hamburger},
    computed: {
      ...mapState({
        listUnseen: state => state.customerCare.listNotification.filter(item => item.status === "UNSEEN"),
      })
    },
    data() {
      return {
        showSidebar: false,
      };
    },
    methods: {
      toggleSidebar() {
        this.showSidebar = !this.showSidebar;
        this.$emit("show-sidebar", this.showSidebar);
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
      hasAnyRole: hasAnyRole,
    }
  };
</script>

<style scoped></style>
