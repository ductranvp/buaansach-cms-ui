<template>
  <el-header height="40px">
    <change-order-seat-dialog ref="changeSeatDialog"/>
    <el-row v-if="currentOrder.guid" class="full-size padding-0-10" type="flex" align="middle" justify="center">
      <el-col :span="18" class="text-small">
        <el-row type="flex" align="middle">
          <div class="padding-right-10">
            <el-tooltip content="Mã đơn">
              <el-tag type="info" effect="dark" size="medium">
                <i class="el-icon-tickets"></i>
                <span>{{currentOrder.orderCode}}</span>
              </el-tag>
            </el-tooltip>
          </div>
          <div class="padding-right-10">
            <el-tooltip :content="'Giờ vào: ' + $moment(currentOrder.orderCheckinTime).format('HH:mm DD/MM/YYYY')">
              <el-tag type="info" effect="dark" size="medium">
                <i class="el-icon-time padding-right-5"></i>
                <span>{{currentOrder.orderCheckinTime | moment("HH:mm")}}</span>
              </el-tag>
            </el-tooltip>
          </div>
          <div class="padding-right-10">
            <el-tooltip content="Làm mới">
              <el-button :loading="isRefreshing" @click="refreshSeatOrder"
                         type="success"
                         plain
                         size="mini">
                <i v-if="!isRefreshing" class="el-icon-refresh"></i>
              </el-button>
            </el-tooltip>
          </div>
          <div>
            <el-popover
              ref="qrPopover"
              placement="bottom"
              width="150"
              trigger="click">
              <div>
                <qrcode class="pointer" @click.native="goto(selectedSeat.guid)" :value="seatPrefixUrl + selectedSeat.guid"
                        :options="{ width: 150 }"></qrcode>
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
  import ChangeOrderSeatDialog from "@/views/private/pos-machine/sidebar/main/ChangeOrderSeatDialog";
  import Constants from "@/utils/constants";

  export default {
    name: "TopToolbar",
    components: {ChangeOrderSeatDialog},
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
    methods: {
      goto(seatGuid) {
        let routeData = this.seatPrefixUrl + seatGuid;
        window.open(routeData, '_blank');
      },
      async refreshSeatOrder() {
        const vm = this;
        try {
          vm.isRefreshing = true;
          await vm.$store.dispatch("posMachine/getSeatOrderInfo", vm.selectedSeat.guid);
          setTimeout(function () {
            vm.isRefreshing = false;
          }, 1000);
        } catch (e) {
          MessageUtils.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
        }
      },
      cancelOrder() {
        const vm = this;
        this.$prompt("Nhập lí do hủy đơn (bắt buộc)", "Xác nhận hủy đơn", {
          confirmButtonText: 'Hủy đơn',
          cancelButtonText: 'Đóng',
          inputType: 'textarea'
        }).then(cb => {
          if (cb.value) {
            try {
              vm.$store.dispatch("posMachine/cancelOrder", cb.value);
              MessageUtils.success("Hủy đơn thành công");
            } catch (e) {
              MessageUtils.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
            }
          } else {
            MessageUtils.error("Bạn phải nhập lí do hủy đơn");
          }
        });
      },
      changeOrderSeat() {
        this.$refs.changeSeatDialog.show();
      }
    }
  };
</script>

<style scoped>
</style>
