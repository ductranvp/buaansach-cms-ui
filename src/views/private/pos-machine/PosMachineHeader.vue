<template>
  <el-header class="bg-success" height="40px">
    <check-printer ref="checkPrinter"/>
    <el-row class="full-size flex-wrap" type="flex" align="middle">
      <el-col :span="8">
        <el-button class="hidden-sm-and-down" size="small" type="success" @click="gotoReport">
          <i class="el-icon-s-data"></i>
          <span class="hidden-md-and-down">Thống kê</span>
        </el-button>
      </el-col>

      <el-col :span="8">
        <el-row class="hidden-md-and-down" type="flex" align="middle" justify="center">
          <el-dropdown trigger="click" @command="changeStoreStatus">
            <el-button size="small" type="success">
              <i class="fas el-icon-fa-store"></i>
              <span v-if="currentStore.storeName" class="text-light text-bold">{{currentStore.storeCode}} - {{currentStore.storeName}}</span>
            </el-button>
            <el-dropdown-menu class="padding-0" slot="dropdown">
              <el-dropdown-item command="CLOSED" v-if="currentStore.storeStatus === 'OPENING'">
                <i class="el-icon-close padding-right-10"></i>
                <span>Đóng cửa</span>
              </el-dropdown-item>
              <el-dropdown-item command="OPENING" v-if="currentStore.storeStatus === 'CLOSED'">
                <i class="el-icon-key padding-right-10"></i>
                <span>Mở cửa</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-tag size="small" type="success" v-if="currentStore.storeStatus === 'OPENING'">Đang mở cửa</el-tag>
          <el-tag size="small" type="danger" v-if="currentStore.storeStatus === 'CLOSED'">Đã đóng cửa</el-tag>
        </el-row>
      </el-col>

      <el-col :span="8">
        <el-row type="flex" align="middle" justify="end">
          <el-row type="flex" align="middle" class="padding-right-10">
            <pos-notification/>
          </el-row>

          <el-row class="padding-0-10" type="flex" align="middle">
            <el-avatar :size="24" :src="currentUser.imageUrl? currentUser.imageUrl : circleUrl"></el-avatar>
          </el-row>

          <el-row class="hidden-sm-and-down" type="flex" align="middle">
            <el-button size="small" type="success">
              <span>{{currentUser.firstName}}</span>
            </el-button>
          </el-row>

          <el-row type="flex" align="middle">
            <el-dropdown trigger="click" @command="goto">
              <el-tooltip content="Menu">
                <el-button class="icon-button" type="success">
                  <i class="el-icon-menu"></i>
                </el-button>
              </el-tooltip>
              <el-dropdown-menu class="padding-0" slot="dropdown">
                <el-dropdown-item command="profilePage">
                  <i class="el-icon-user padding-right-10"></i>
                  <span>Tài khoản</span>
                </el-dropdown-item>
                <el-dropdown-item @click.native="checkPrinter">
                  <i class="el-icon-printer padding-right-10"></i>
                  <span>Kiểm tra máy in</span>
                  <span></span>
                </el-dropdown-item>
                <el-dropdown-item @click.native="downloadTeamViewer">
                  <i class="el-icon-s-promotion padding-right-10"></i>
                  <span>Tải TeamViewer</span>
                  <span></span>
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
  import PosStoreService from "@/service/pos/pos.store.service";
  import PosNotification from "@/views/private/pos-machine/header/notification/PosNotification";
  import CheckPrinter from "@/views/private/pos-machine/CheckPrinter";
  import MessageUtils from "@/utils/message.util";

  export default {
    name: "PosMachineHeader",
    components: {CheckPrinter, PosNotification},
    computed: {
      ...mapState({
        currentUser: state => state.user.info,
        currentStore: state => state.posMachine.currentStore,
      })
    },
    data() {
      return {
        circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      };
    },
    methods: {
      downloadTeamViewer() {
        let win = window.open("https://download.teamviewer.com/full", '_blank');
        win.focus();
      },
      checkPrinter() {
        this.$refs.checkPrinter.printTest();
      },
      gotoReport() {
        this.$router.push({name: 'saleReportPage', params: {storeGuid: this.$route.params.storeGuid}});
      },
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
      async changeStoreStatus(status) {
        try {
          const payload = {
            storeGuid: this.$route.params.storeGuid,
            storeStatus: status
          };
          if (this.currentStore.storeStatus !== status) {
            await PosStoreService.changeStoreStatus(payload);
            this.$store.commit("posMachine/CHANGE_STORE_STATUS", status);
          }
        } catch (e) {
          MessageUtils.error("Đổi trạng thái cửa hàng không thành công!");
        }
      }
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

  /deep/ .el-dropdown-menu__item {
    line-height: 40px;
    font-size: 16px;
  }
</style>
