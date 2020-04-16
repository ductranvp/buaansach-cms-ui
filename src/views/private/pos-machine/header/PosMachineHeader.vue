<template>
  <el-header class="bg-success padding-10" height="auto">
    <el-row class="full-size flex-wrap" type="flex" align="middle">
      <el-col :md="12" :sm="24" :xs="24">
        <el-button type="success" @click="goto('homePage')">
          <i class="el-icon-s-home"></i>
          <span class="hidden-sm-and-down">Trang chủ</span>
        </el-button>
        <el-button type="success" @click="goto('homePage')">
          <i class="el-icon-s-data"></i>
          <span class="hidden-sm-and-down">Báo cáo</span>
        </el-button>
      </el-col>

      <el-col :md="12" :sm="24" :xs="24">
        <el-row type="flex" align="middle" justify="end">
          <el-row type="flex" align="middle">
            <el-dropdown trigger="click">
              <el-button class="icon-button" type="success">
                <i class="el-icon-message-solid"></i>
              </el-button>
              <el-dropdown-menu class="padding-0" slot="dropdown">

              </el-dropdown-menu>
            </el-dropdown>
          </el-row>

          <el-row class="padding-0-10" type="flex" align="middle">
            <el-avatar :size="32" :src="circleUrl"></el-avatar>
          </el-row>

          <el-row class="hidden-sm-and-down" type="flex" align="middle">
            <el-button type="success">
              <span>{{currentUser.firstName}}</span>
            </el-button>
          </el-row>

          <el-row type="flex" align="middle">
            <el-dropdown trigger="click" @command="goto">
              <el-button class="icon-button" type="success">
                <i class="el-icon-menu"></i>
              </el-button>
              <el-dropdown-menu class="padding-0" slot="dropdown">
                <el-dropdown-item command="">
                  <i class="el-icon-user padding-right-10"></i>
                  <span>Tài khoản</span>
                </el-dropdown-item>
                <el-dropdown-item command="">
                  <i class="el-icon-key padding-right-10"></i>
                  <span>Đổi mật khẩu</span>
                </el-dropdown-item>
                <el-divider class="margin-0"></el-divider>
                <el-dropdown-item command="logout">
                  <i class="el-icon-switch-button padding-right-10"></i>
                  <span>Đăng xuất</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-row>
        </el-row>
      </el-col>
    </el-row>
  </el-header>
</template>

<script>
  import AuthUtils from "@/utils/auth.util";
  import MessageBoxUtils from "@/utils/message-box.util";
  import {mapState} from "vuex";

  export default {
    name: "PosMachineHeader",
    computed: {
      ...mapState({
        currentUser: state => state.user.info
      })
    },
    data() {
      return {
        circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      };
    },
    methods: {
      goto(routeName) {
        if (!routeName) return;
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

<style scoped>
  .icon-button {
    padding: 0;
    height: 40px;
    width: 40px;
    font-size: 28px
  }

  /deep/ .el-dropdown-menu__item {
    line-height: 40px;
    font-size: 16px;
  }
</style>
