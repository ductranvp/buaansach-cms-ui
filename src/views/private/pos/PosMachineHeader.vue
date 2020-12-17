<template>
  <el-header class="bg-success" height="40px">
    <audio style="display: none" id="store_order_sound">
      <source :src="storeOrderSound" type="audio/mpeg" />
    </audio>
    <audio style="display: none" id="call_waiter_sound">
      <source :src="callWaiterSound" type="audio/mpeg" />
    </audio>
    <audio style="display: none" id="store_pay_request_sound">
      <source :src="storePayRequestSound" type="audio/mpeg" />
    </audio>
    <check-printer ref="checkPrinter" />
    <el-row class="full-size flex-wrap" type="flex" align="middle">
      <el-col :span="8">
        <el-row type="flex" align="middle">
          <div>
            <notification
              :type="notificationType.CALL_WAITER"
              placement="bottom-start"
            />
          </div>
          <div class="padding-left-20 padding-right-10">
            <el-tooltip>
              <div slot="content">
                <span v-if="muteSound">Bấm để bật âm thanh thông báo</span>
                <span v-else>Bấm để tắt âm thanh thông báo</span>
              </div>
              <el-button
                @click="toggleSound"
                class="icon-button"
                type="success"
              >
                <i v-if="muteSound" class="fas el-icon-fa-volume-mute"></i>
                <i v-else class="fas el-icon-fa-volume-up"></i>
              </el-button>
            </el-tooltip>
          </div>
          <div>
            <el-popover
              ref="qrPopover"
              placement="bottom"
              width="200"
              trigger="click"
            >
              <div class="text-center">
                <qr-code
                  :text="posMobileUrl"
                  class="pointer"
                  :size="200"
                  @click.native="openUrl()"
                />
              </div>
            </el-popover>
            <el-button v-popover:qrPopover type="success" size="small">
              <i class="el-icon-mobile"></i>
              <span>Trang QR</span>
            </el-button>
          </div>
        </el-row>
      </el-col>

      <el-col :span="8">
        <el-dropdown trigger="click" @command="changeStoreStatus">
          <el-button
            size="small"
            type="success"
            :title="currentStore.storeName"
          >
            <i class="fas el-icon-fa-store"></i>
            <span class="text-light text-bold">{{
              currentStore.storeCode
            }}</span>
            <span> - </span>
            <span class="text-light text-bold">{{
              currentStore.storeName
            }}</span>
          </el-button>
          <el-dropdown-menu class="padding-0" slot="dropdown">
            <el-dropdown-item
              command="CLOSED"
              v-if="currentStore.storeStatus === storeStatusValue.OPENING"
            >
              <i class="el-icon-close padding-right-10"></i>
              <span>Đóng cửa</span>
            </el-dropdown-item>
            <el-dropdown-item
              command="OPENING"
              v-if="currentStore.storeStatus === storeStatusValue.CLOSED"
            >
              <i class="el-icon-key padding-right-10"></i>
              <span>Mở cửa</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!--        <el-tag size="small" type="success" v-if="currentStore.storeStatus === storeStatusValue.OPENING">Mở cửa</el-tag>-->
        <!--        <el-tag size="small" type="danger" v-if="currentStore.storeStatus === storeStatusValue.CLOSED">Đóng cửa</el-tag>-->
      </el-col>

      <el-col :span="8">
        <el-row type="flex" align="middle" justify="end">
          <!--        <el-button class="hidden-sm-and-down" size="small" type="success" @click="gotoReport">-->
          <!--          <i class="el-icon-s-data"></i>-->
          <!--          <span class="hidden-md-and-down">Thống kê</span>-->
          <!--        </el-button>-->
          <el-tooltip
            v-if="serverTime"
            :content="
              'Giờ hệ thống: ' +
                $moment(serverTime).format('HH:mm:ss DD/MM/YYYY')
            "
          >
            <el-button class="hidden-sm-and-down" size="small" type="success">
              <i class="el-icon-time"></i>
              <span class="hidden-md-and-down">{{
                serverTime | moment("HH:mm:ss")
              }}</span>
            </el-button>
          </el-tooltip>

          <el-row class="hidden-sm-and-down" type="flex" align="middle">
            <el-button size="small" type="success">
              <span>{{ currentUser.fullName }}</span>
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
                <!--                <el-dropdown-item command="profilePage">-->
                <!--                  <i class="el-icon-user padding-right-10"></i>-->
                <!--                  <span>Tài khoản</span>-->
                <!--                </el-dropdown-item>-->
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
                <el-dropdown-item @click.native="setupTeamViewer">
                  <i class="el-icon-help padding-right-10"></i>
                  <span>HD cài TeamViewer</span>
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
import { mapState } from "vuex";
import PosStoreService from "@/service/pos/pos.store.service";
import CheckPrinter from "@/views/private/pos/CheckPrinter";
import StoreOrderSound from "@/assets/sounds/store_order.mp3";
import StorePayRequestSound from "@/assets/sounds/store_pay_request.mp3";
import CallWaiterSound from "@/assets/sounds/call_waiter.mp3";
import ServerTimeService from "@/service/shared/server-time.service";
import Notification from "@/views/private/pos/header/notification/Notification";
import StoreNotificationType from "@/enum/StoreNotificationType";
import StorageKey from "@/utils/storage-key";
import ErrorUtils from "@/utils/error.util";
import StoreStatus from "@/enum/StoreStatus";
import Constants from "@/utils/constants";
import QrCode from "@/components/qr-code/QRCode";

export default {
  name: "PosMachineHeader",
  components: {
    QrCode,
    Notification,
    CheckPrinter
  },
  computed: {
    ...mapState({
      currentStore: state => state.posMachine.currentStore
    }),
    posMobileUrl() {
      return Constants.CMS_UI_URL + "/mobile/" + this.$route.params.storeGuid;
    }
  },
  data() {
    return {
      serverTime: null,
      storeOrderSound: StoreOrderSound,
      callWaiterSound: CallWaiterSound,
      storePayRequestSound: StorePayRequestSound,
      muteSound: false,
      notificationType: StoreNotificationType.value,
      storeStatusValue: StoreStatus.value
    };
  },
  created() {
    const muteSound = localStorage.getItem(
      StorageKey.localStorageKeys.MUTE_SOUND
    );
    this.muteSound = muteSound === "yes";
    this.getServerTime();
  },
  methods: {
    openUrl(url, newTab) {
      if (Constants.APP_MODE === "prod") return;
      window.open(this.posMobileUrl, "_blank");
    },
    async getServerTime() {
      try {
        let start = new Date().getTime();
        const { data } = await ServerTimeService.getServerTime();
        let end = new Date().getTime();
        let server = new Date(data);
        const diff = end - start;
        this.serverTime = new Date(server.getTime() + diff);
        setInterval(this.updateTime, 1000);
      } catch (error) {
        // Error get server time;
        this.serverTime = new Date();
        ErrorUtils.showErrorMessage(error);
      }
    },
    updateTime() {
      this.serverTime = new Date(this.serverTime.getTime() + 1000);
    },
    toggleSound() {
      this.muteSound = !this.muteSound;
      if (this.muteSound) {
        localStorage.setItem(StorageKey.localStorageKeys.MUTE_SOUND, "yes");
      } else {
        localStorage.setItem(StorageKey.localStorageKeys.MUTE_SOUND, "no");
      }
    },
    downloadTeamViewer() {
      let win = window.open(
        "https://download.teamviewer.com/full",
        "_blank",
        "width=500,height=500"
      );
      win.focus();
    },
    setupTeamViewer() {
      let win = window.open(
        "https://quantrimang.com/dieu-khien-may-tinh-tu-xa-voi-teamviewer-9-106917",
        "_blank",
        "width=500,height=500"
      );
      win.focus();
    },
    checkPrinter() {
      this.$refs.checkPrinter.printTest();
    },
    gotoReport() {
      this.$router.push({
        name: "saleReportPage",
        params: { storeGuid: this.$route.params.storeGuid }
      });
    },
    goto(routeName) {
      if (!routeName) return;
      if (routeName === "logout") {
        MessageBoxUtils.confirm("Thoát tài khoản", function() {
          AuthUtils.logout();
        });
      } else {
        this.$router.push({ name: routeName }).catch(() => {});
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
      } catch (error) {
        ErrorUtils.showErrorMessage(
          error,
          "Đổi trạng thái cửa hàng không thành công!"
        );
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
  font-size: 22px;
}

/deep/ .el-dropdown-menu__item {
  line-height: 40px;
  font-size: 16px;
}
</style>
