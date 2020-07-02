<template>
  <el-aside width="250px" style="border-left: 1px solid #bbb">
    <el-container direction="vertical" class="full-size">
      <el-header height="50px" class="bg-success">
        <el-row class="full-size padding-0-10" type="flex" align="middle" justify="center">
          <el-col>
            <el-badge :hidden="listUnseen.length === 0" :value="listUnseen.length" class="item">
              <el-button class="padding-5" size="medium" type="success">
                <i class="el-icon-message-solid"></i>
                <span>Thông báo</span>
              </el-button>
            </el-badge>
          </el-col>
          <el-button @click="markAllAsRead" type="success" size="small">
            <i class="fas el-icon-fa-envelope-open"></i>
            <span>Đã xem tất cả</span>
          </el-button>
        </el-row>
      </el-header>
      <el-main class="full-size bg-white">
        <el-row type="flex" align="middle" class="padding-5">
          <el-col class="text-center">
            <el-checkbox v-model="showNewCustomer">Đăng ký</el-checkbox>
          </el-col>
          <el-col class="text-center">
            <el-checkbox v-model="showCustomerPurchase">Thanh toán</el-checkbox>
          </el-col>
        </el-row>
        <el-divider class="margin-0"></el-divider>
        <template v-for="noti in listNotification">
          <el-alert :closable="false" class="pointer full-width padding-5-10"
                    v-if="noti.type === 'NEW_CUSTOMER' && showNewCustomer ||
                    noti.type === 'CUSTOMER_PURCHASE' && showCustomerPurchase"
                    :type="noti.status ==='UNSEEN' ? 'warning' : ''"
                    :key="noti.id">
            <el-row class="full-size" type="flex" align="middle">
              <el-col @click.native="seenNotification(noti)">
                <div class="padding-10-0 text-small">
                  <el-tag :type="noti.type === 'NEW_CUSTOMER' ? 'info' : 'success'" size="mini">{{noti.customerPhone}}
                  </el-tag>
                  <span> {{noti.message}}</span>
                </div>
              </el-col>
              <el-button @click="closeNotification(noti)" size="mini" type="text">
                <i class="el-icon-close"></i>
              </el-button>
            </el-row>
          </el-alert>
          <el-divider v-if="noti.type === 'NEW_CUSTOMER' && showNewCustomer ||
                    noti.type === 'CUSTOMER_PURCHASE' && showCustomerPurchase" class="margin-0" :key="noti.id"></el-divider>
        </template>
      </el-main>
      <el-footer height="auto">
        <el-row class="bg-white" type="flex" align="middle" justify="start">
          <el-button @click="clearSeenNotifications" plain class="full-width no-border-radius no-border" type="info">
            <i class="fas el-icon-fa-eraser"></i>
            <span>Xóa Đã Xem</span>
          </el-button>
        </el-row>
        <el-row class="bg-white" type="flex" align="middle" justify="start">
          <el-button @click="clearAllNotification" plain class="full-width no-border-radius no-border" type="danger">
            <i class="el-icon-delete"></i>
            <span>Xóa Tất Cả</span>
          </el-button>
        </el-row>
      </el-footer>
    </el-container>
  </el-aside>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: "CustomerCareSidebar",
    computed: {
      ...mapState({
        listNotification: state => state.customerCare.listNotification,
        listUnseen: state => state.customerCare.listNotification.filter(item => item.status === "UNSEEN"),
      })
    },
    data() {
      return {
        showNewCustomer: true,
        showCustomerPurchase: true,
      };
    },
    methods: {
      markAllAsRead() {
        this.$store.commit("customerCare/MARK_ALL_AS_READ");
      },
      seenNotification(noti) {
        this.$store.commit("customerCare/MARK_AS_READ", noti);
      },
      closeNotification(noti) {
        this.$store.commit("customerCare/CLOSE_NOTIFICATION", noti);
      },
      clearAllNotification() {
        this.$store.commit("customerCare/SET_LIST_NOTIFICATION", []);
      },
      clearSeenNotifications() {
        this.$store.commit("customerCare/CLEAR_SEEN_NOTIFICATION");
      }
    }
  };
</script>

<style scoped>
  /deep/ .el-alert__content {
    padding: 0;
    width: 100%;
  }

  /deep/ .el-alert__description {
    margin: 0;
  }
</style>
