<template>
  <el-row v-loading="isLoading" type="flex" align="middle"
          class="padding-5-10 notification-item"
          :class="notification.storeOrderStatus === 'UNSEEN' ? 'unseen-notification' : ''">
    <el-col class="padding-right-10" @click.native="clickNotification(notification)">
      <div>
        <b>{{notification.title}}</b>
        <em> ({{notification.numberOfProduct}} loại sản phẩm)</em>
      </div>
      <el-row type="flex" align="middle">
        <el-col>
          <el-tooltip placement="top" :content="$moment(notification.createdDate).format('HH:mm:ss - DD/MM/YYYY')">
            <el-tag size="mini" type="info">
              <i class="el-icon-time"></i>
              <span>{{notification.createdDate | moment("HH:mm:ss")}}</span>
            </el-tag>
          </el-tooltip>
          <el-tooltip placement="top" content="Người gọi">
            <el-tag class="margin-left-10" size="mini" type="info">
              <i class="el-icon-s-claim"></i>
              <span v-if="notification.createdBy === 'anonymousUser'">Khách</span>
              <span v-else>{{notification.createdBy}}</span>
            </el-tag>
          </el-tooltip>
          <el-tooltip placement="top" v-if="notification.firstSeenBy" content="Người xem đầu">
            <el-tag class="margin-left-10" size="mini" type="info">
              <i class="fas el-icon-fa-eye"></i>
              <span>{{notification.firstSeenBy}}</span>
            </el-tag>
          </el-tooltip>
          <el-tooltip placement="top" v-if="notification.hidden && notification.firstHideBy"
                      content="Người ẩn thông báo">
            <el-tag class="margin-left-10" size="mini" type="info">
              <i class="fas el-icon-fa-eye-slash"></i>
              <span>{{notification.firstHideBy}}</span>
            </el-tag>
          </el-tooltip>
        </el-col>
      </el-row>
    </el-col>
    <el-tooltip placement="top" content="Ẩn thông báo" v-if="!notification.hidden">
      <el-button @click="toggleNotification(notification, true)" type="text"
                 class="text-info text-very-large">
        <i class="el-icon-close"></i>
      </el-button>
    </el-tooltip>
    <el-tooltip placement="top" v-else content="Hiện lại thông báo">
      <el-button @click="toggleNotification(notification, false)" type="text"
                 class="text-info text-very-large">
        <i class="el-icon-refresh-right"></i>
      </el-button>
    </el-tooltip>
  </el-row>
</template>

<script>
  import MessageUtils from "@/utils/message.util";
  import {mapState} from "vuex";
  import PosStoreOrderService from "@/service/pos/pos.store-order.service";

  export default {
    name: "NotificationItem",
    computed: {
      ...mapState({
        selectedSeat: state => state.posMachine.selectedSeat,
        currentStore: state => state.posMachine.currentStore,
      })
    },
    props: {
      selectable: {
        type: Boolean,
        default: true
      },
      notification: Object
    },
    data() {
      return {
        isLoading: false
      };
    },
    methods: {
      scrollToOrder() {
        let container = document.querySelector(".scroll");
        let firstActivated = document.querySelector(".is-activated");
        if (container) {
          container.scrollTop = firstActivated.offsetTop - 60;
        }
      },
      async clickNotification(notification) {
        if (!this.selectable) return;
        if (this.currentStore.storeStatus === 'CLOSED') {
          MessageUtils.error("Cửa hàng đã đóng cửa");
          return;
        }

        if (this.selectedSeat.guid !== notification.seat.guid) {
          await this.$store.dispatch("posMachine/selectSeat", notification.seat);
        }

        this.$store.commit("posMachine/SET_ACTIVE_ORDER_PRODUCT_GROUP", notification.orderProductGroup);

        if (notification.storeOrderStatus !== "SEEN") {
          this.markAsRead(notification);
        }
      },
      async markAsRead(notification) {
        let payload = {
          guid: notification.guid,
          storeOrderStatus: "SEEN"
        };
        try {
          this.isLoading = true;
          const {data} = await PosStoreOrderService.updateStoreOrder(payload);
          notification.firstSeenBy = data.firstSeenBy;
          notification.storeOrderStatus = "SEEN";
          this.isLoading = false;
        } catch (e) {
          this.isLoading = false;
        }
      },
      async toggleNotification(notification, hidden) {
        let payload = {
          storeGuid: this.$route.params.storeGuid,
          listGuid: [notification.guid],
          hidden: hidden
        };
        try {
          this.isLoading = true;
          await PosStoreOrderService.toggleVisibility(payload);
          notification.hidden = hidden;
          this.isLoading = false;
        } catch (e) {
          this.isLoading = false;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .notification-item {
    line-height: 24px;
    border-bottom: 1px solid #bbb
  }

  .unseen-notification {
    background-color: $--color-warning-light;
  }

  .notification-item i {
    margin-right: 5px;
  }
</style>
