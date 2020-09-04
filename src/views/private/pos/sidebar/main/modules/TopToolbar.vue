<template>
  <el-header height="40px">
    <change-order-seat-dialog ref="changeSeatDialog"/>
    <cancel-order-dialog ref="cancelOrderDialog"/>
    <el-row v-if="currentOrder.guid" class="full-size padding-0-10" type="flex" align="middle" justify="center">
      <el-col :span="18" class="text-small">
        <el-row type="flex" align="middle">
          <div class="padding-right-10">
            <el-tooltip :content="'Mã đơn: ' + currentOrder.orderCode">
              <el-tag type="info" effect="dark" size="medium">
                <i class="el-icon-tickets"></i>
              </el-tag>
            </el-tooltip>
          </div>
          <div class="padding-right-10">
            <el-tooltip :content="'Giờ vào: ' + $moment(currentOrder.orderCheckinTime).format('HH:mm:ss - DD/MM/YYYY')">
              <el-tag type="info" effect="dark" size="medium">
                <i class="el-icon-time padding-right-5"></i>
                <span>{{currentOrder.orderCheckinTime | moment("HH:mm")}}</span>
              </el-tag>
            </el-tooltip>
          </div>
          <div class="padding-right-10">
            <el-popover
              ref="qrPopover"
              placement="bottom"
              width="150"
              trigger="click">
              <div>
<!--                <div>Không gồm mã đơn:</div>-->
<!--                <qrcode class="pointer" @click.native="goto(selectedSeat.guid)"-->
<!--                        :value="seatPrefixUrl + selectedSeat.guid"-->
<!--                        :options="{ width: 150 }">-->
<!--                </qrcode>-->
                <div class="text-center">Đã bao gồm mã đơn:</div>
                <qrcode class="pointer" @click.native="goto(selectedSeat.guid, currentOrder.guid)"
                        :value="seatPrefixUrl + selectedSeat.guid + '?resume=' + currentOrder.guid"
                        :options="{ width: 150 }">
                </qrcode>
              </div>
            </el-popover>
            <el-tooltip content="QR Code">
              <el-button v-popover:qrPopover
                         type="success"
                         plain
                         size="mini">
                <i class="fas el-icon-fa-qrcode"></i>
              </el-button>
            </el-tooltip>
          </div>
          <div>
            <el-button :loading="isRefreshing" @click="refreshSeatOrder"
                       type="success"
                       plain
                       size="mini">
              <i v-if="!isRefreshing" class="el-icon-refresh"></i>
              <span>Làm mới (F8)</span>
            </el-button>
          </div>
        </el-row>
      </el-col>
      <el-col :span="6" class="text-right">
        <el-dropdown trigger="click">
          <el-button type="info" size="mini">
            <i class="el-icon-s-unfold"></i>
            <span>Tùy chọn</span>
          </el-button>
          <el-dropdown-menu class="padding-0" slot="dropdown">
            <el-dropdown-item @click.native="changeOrderSeat">
              <span>Chuyển bàn</span>
            </el-dropdown-item>
            <el-dropdown-item @click.native="cancelOrder">
              <span>Hủy đơn</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
  </el-header>
</template>

<script>
  import {mapState} from "vuex";
  import MessageUtils from "@/utils/message.util";
  import ChangeOrderSeatDialog from "@/views/private/pos/sidebar/main/ChangeOrderSeatDialog";
  import Constants from "@/utils/constants";
  import hotkeys from "hotkeys-js";
  import CancelOrderDialog from "@/views/private/pos/sidebar/main/dialog/CancelOrderDialog";

  export default {
    name: "TopToolbar",
    components: {CancelOrderDialog, ChangeOrderSeatDialog},
    computed: {
      ...mapState({
        currentOrder: state => state.posMachine.currentOrder,
        selectedSeat: state => state.posMachine.selectedSeat,
      })
    },
    data() {
      return {
        seatPrefixUrl: Constants.CUSTOMER_UI_SEAT_PREFIX_URL,
        isRefreshing: false,
      };
    },
    mounted() {
      const vm = this;
      hotkeys.filter = function (event) {
        return true;
      };
      hotkeys('f8', 'posMachine', function (event, handler) {
        if (vm.currentOrder.guid && !vm.isRefreshing) {
          vm.refreshSeatOrder();
        }
      });
      hotkeys.setScope("posMachine");
    },
    methods: {
      goto(seatGuid, orderGuid) {
        if (Constants.APP_MODE === 'prod') return;
        let routeData = this.seatPrefixUrl + seatGuid;
        if (orderGuid) {
          routeData += "?resume=" + orderGuid;
        }
        window.open(routeData, '_blank', "width=400; height=640");
      },
      async refreshSeatOrder() {
        const vm = this;
        try {
          vm.isRefreshing = true;
          await vm.$store.dispatch("posMachine/getSeatOrderInfo", vm.selectedSeat.guid);
          setTimeout(function () {
            vm.isRefreshing = false;
          }, 300);
        } catch (e) {
          MessageUtils.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
        }
      },
      cancelOrder() {
        this.$refs.cancelOrderDialog.show();
      },
      changeOrderSeat() {
        this.$refs.changeSeatDialog.show();
      }
    }
  };
</script>

<style scoped>
</style>
