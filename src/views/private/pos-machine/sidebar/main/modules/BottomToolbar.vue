<template>
  <el-footer height="40px">
    <cancel-order-dialog ref="cancelOrderDialog"/>
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

        <el-row type="flex" align="middle" class="full-size" v-else>
          <el-col class="full-height">
            <el-button :loading="isLoading" type="success"
                       class="no-border no-border-radius full-size text-small"
                       :disabled="isAllOrderProductDone"
                       @click="serveAllOrderProduct"
                       size="small">
              <i class="fas el-icon-fa-check"></i>
              <span>Xong tất cả</span>
            </el-button>
          </el-col>
          <el-col class="full-height">
            <el-button :disabled="!unsavedOrderProduct.length" :loading="isLoading"
                       type="warning"
                       class="no-border no-border-radius full-size text-small"
                       @click="updateOrder"
                       size="small">
              <i class="fas el-icon-fa-save"></i>
              <span>Lưu danh sách</span>
            </el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-footer>
</template>

<script>
  import {mapState} from "vuex";
  import MessageUtils from "@/utils/message.util";
  import CancelOrderDialog from "@/views/private/pos-machine/sidebar/main/dialog/CancelOrderDialog";

  export default {
    name: "BottomToolbar",
    components: {CancelOrderDialog},
    computed: {
      ...mapState({
        currentOrder: state => state.posMachine.currentOrder,
        selectedCategory: state => state.posMachine.selectedCategory,
        unsavedOrderProduct: state => state.posMachine.unsavedOrderProduct,
        isAllOrderProductDone: state => {
          const temp = state.posMachine.savedOrderProduct.filter(item => item.orderProductStatus === state.posMachine.orderProductStatus.PREPARING);
          return temp.length === 0;
        },
      })
    },
    data() {
      return {
        isLoading: false,
      };
    },
    methods: {
      cancelOrder() {
        this.$refs.cancelOrderDialog.show();
      },
      async receiveOrder() {
        try {
          this.isLoading = true;
          await this.$store.dispatch("posMachine/receiveOrder");
          this.isLoading = false;
        } catch (error) {
          this.isLoading = false;
          MessageUtils.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
        }
      },
      async updateOrder() {
        const vm = this;
        try {
          vm.isLoading = true;
          await this.$store.dispatch("posMachine/updateOrder");
          vm.isLoading = false;
        } catch (error) {
          const message = error.message || error.data.message;
          if (message.includes("productStopTrading")) {
            this.refreshStoreProduct();
            MessageUtils.error("Danh sách sản phẩm đã thay đổi. Vui lòng kiểm tra lại");
          } else {
            MessageUtils.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
          }
          vm.isLoading = false;
        }
      },
      async refreshStoreProduct() {
        const vm = this;
        try {
          await vm.$store.dispatch("posMachine/getAllCategory", vm.$route.params.storeGuid);
          await vm.$store.dispatch("posMachine/changeCategory", vm.selectedCategory.guid);
        } catch (e) {
          MessageUtils.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
        }
      },
      async serveAllOrderProduct() {
        const vm = this;
        try {
          vm.isLoading = true;
          await this.$store.dispatch("posMachine/serveAllOrderProduct");
          vm.isLoading = false;
        } catch (error) {
          vm.isLoading = false;
          MessageUtils.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
        }
      }
    }
  };
</script>

<style scoped>

</style>
