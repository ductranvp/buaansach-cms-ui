<template>
  <el-footer height="40px">
    <el-row style="overflow: hidden" class="full-size" type="flex" align="middle" v-if="currentOrder.guid">
      <el-col class="full-height">
        <el-row type="flex" align="middle" class="full-size" v-if="currentOrder.orderStatus ==='CREATED'">
          <el-col class="full-height">
            <el-button :loading="isLoading" type="success"
                       class="no-border no-border-radius full-size text-small"
                       @click="receiveOrder"
                       size="small">
              <i class="fas el-icon-fa-angle-double-right"></i>
              <span>Tiếp nhận đơn</span>
            </el-button>
          </el-col>
          <el-col class="full-height">
            <el-button :loading="isLoading" type="danger"
                       class="no-border no-border-radius full-size text-small"
                       @click="cancelOrder"
                       size="small">
              <i class="fas el-icon-fa-times"></i>
              <span>Hủy đơn</span>
            </el-button>
          </el-col>
        </el-row>
        <el-button v-else :disabled="!unsavedOrderProduct.length" :loading="isLoading" type="info"
                   class="no-border no-border-radius full-size text-small"
                   @click="updateOrder"
                   size="small">
          <i class="fas el-icon-fa-save"></i>
          <span>Lưu danh sách</span>
        </el-button>
      </el-col>
    </el-row>
  </el-footer>
</template>

<script>
  import {mapState} from "vuex";
  import NotificationUtils from "@/utils/notification.util";
  import MessageUtils from "@/utils/message.util";

  export default {
    name: "BottomToolbar",
    computed: {
      ...mapState({
        currentOrder: state => state.posMachine.currentOrder,
        unsavedOrderProduct: state => state.posMachine.unsavedOrderProduct,
      })
    },
    data() {
      return {
        isLoading: false,
      };
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
      receiveOrder() {
        try {
          this.isLoading = true;
          this.$store.dispatch("posMachine/receiveOrder");
          NotificationUtils.success("Tiếp nhận đơn thành công");
          this.isLoading = false;
        } catch (error) {
          this.isLoading = false;
          NotificationUtils.error("Tiếp nhận đơn thất bại, vui lòng thử lại");
        }
      },
      async updateOrder() {
        const vm = this;
        vm.isLoading = true;
        try {
          await this.$store.dispatch("posMachine/updateOrder");
          NotificationUtils.success("Lưu đơn thành công");
        } catch (error) {
          NotificationUtils.error("Đã xảy ra lỗi, vui lòng thử lại");
        }
        vm.isLoading = false;
      },
    }
  };
</script>

<style scoped>

</style>
