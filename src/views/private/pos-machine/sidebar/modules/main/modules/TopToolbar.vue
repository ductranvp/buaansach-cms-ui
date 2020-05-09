<template>
  <el-header height="40px">
    <change-order-seat-dialog ref="changeSeatDialog"/>
    <el-row v-if="currentOrder.guid" class="full-size padding-0-10" type="flex" align="middle" justify="center">
      <el-col :span="18" class="text-small">
        <el-row :gutter="10" type="flex" align="middle">
          <el-col>
            <el-tag type="info" effect="dark" size="medium">Mã đơn: {{currentOrder.orderCode}}</el-tag>
          </el-col>
          <el-col>
            <el-tag type="info" effect="dark" size="medium">
              <span>Giờ vào: {{currentOrder.orderCheckinTime | moment("HH:mm")}}</span>
            </el-tag>
          </el-col>
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
  import ChangeOrderSeatDialog from "@/views/private/pos-machine/sidebar/modules/main/ChangeOrderSeatDialog";
  import NotificationUtils from "@/utils/notification.util";

  export default {
    name: "TopToolbar",
    components: {ChangeOrderSeatDialog},
    computed: {
      ...mapState({
        currentOrder: state => state.posMachine.currentOrder,
      })
    },
    methods: {
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
              NotificationUtils.success("Hủy đơn thành công");
            } catch (e) {
              NotificationUtils.error("Đã có lỗi xảy ra, vui lòng thử lại");
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
