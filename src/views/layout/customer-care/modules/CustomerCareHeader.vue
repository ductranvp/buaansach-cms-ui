<template>
  <el-header height="50px" class="bg-success padding-0-10">
    <audio style="display: none" id="new_customer_sound">
      <source :src="soundSrc" type="audio/mpeg">
    </audio>
    <el-row
      class="full-size"
      type="flex"
      align="middle"
      justify="space-between"
    >
      <el-col>
<!--        <router-link to="/">-->
<!--          <img src="/logo_square.png" class="bas-logo">-->
<!--        </router-link>-->
        <el-button size="medium" type="success" @click="goBack">
          <i class="el-icon-arrow-left"></i>
          <span>Quay lại</span>
        </el-button>
<!--        <el-button class="padding-10" type="success" @click="goto('homePage')">-->
<!--          <span class="hidden-sm-and-down">BỮA ĂN SẠCH</span>-->
<!--        </el-button>-->
      </el-col>
      <el-button type="success" size="medium" @click="goto('logout')">
        <i class="fas el-icon-fa-sign-out-alt"></i>
        <span class="hidden-xs-only">Đăng xuất</span>
      </el-button>
      <div class="padding-right-10">
        <el-tooltip :content="muteSound ? 'Bấm để bật âm thanh thông báo' : 'Bấm để tắt âm thanh thông báo'">
          <el-button @click="toggleSound" class="icon-button" type="success">
            <i v-if="muteSound" class="fas el-icon-fa-volume-mute"></i>
            <i v-else class="fas el-icon-fa-volume-up"></i>
          </el-button>
        </el-tooltip>
      </div>
      <div v-if="!showSidebar" class="padding-right-20">
        <el-badge :hidden="listUnseen.length === 0" :value="listUnseen.length" class="item">
          <el-button @click="toggleSidebar" class="padding-5" size="medium" type="success">
            <i class="el-icon-message-solid"></i>
            <span class="hidden-xs-only">Thông báo</span>
          </el-button>
        </el-badge>
      </div>
      <el-tooltip content="Ẩn / Hiện thanh công cụ">
        <hamburger :is-active="!showSidebar" fill="#fff" @toggleClick="toggleSidebar"/>
      </el-tooltip>
    </el-row>
  </el-header>
</template>

<script>
  import AuthUtils from "@/utils/auth.util";
  import MessageBoxUtils from "@/utils/message-box.util";
  import hasAnyRole from "@/utils/has-any-role";
  import Hamburger from "@/components/hamburger/index";
  import {mapState} from "vuex";
  import NewCustomerSound from "@/assets/sounds/new_customer.mp3";

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
        showSidebar: true,
        soundSrc: NewCustomerSound,
        muteSound: false,
      };
    },
    created(){
      const muteSound = sessionStorage.getItem("muteCustomerSound");
      this.muteSound = muteSound === "yes";
    },
    methods: {
      toggleSound(){
        this.muteSound = !this.muteSound;
        if (this.muteSound){
          sessionStorage.setItem("muteCustomerSound", "yes");
        } else {
          sessionStorage.setItem("muteCustomerSound", "no");
        }
      },
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
      goBack() {
        this.$router.go(-1);
      },
      hasAnyRole: hasAnyRole,
    }
  };
</script>

<style scoped>
  .icon-button {
    padding: 0;
    height: 32px;
    width: 32px;
    font-size: 22px
  }
</style>
