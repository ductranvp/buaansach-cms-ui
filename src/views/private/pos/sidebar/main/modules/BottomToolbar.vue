<template>
  <el-footer height="40px">
    <cancel-order-dialog ref="cancelOrderDialog"/>
    <el-row style="overflow: hidden" class="full-size" type="flex" align="middle" v-if="currentOrder.guid">
      <el-col class="full-height">
        <el-row type="flex" align="middle" class="full-size" v-if="currentOrder.orderStatus === orderStatusValue.CREATED">
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
  import {mapState} from 'vuex';
  import CancelOrderDialog from '@/views/private/pos/sidebar/main/dialog/CancelOrderDialog';
  import OrderProductStatus from '@/enum/OrderProductStatus';
  import ErrorUtils from '@/utils/error.util';
  import OrderStatus from '@/enum/OrderStatus';
  import ErrorCode from '@/enum/ErrorCode';

  export default {
    name: 'BottomToolbar',
    components: {CancelOrderDialog},
    computed: {
      ...mapState({
        currentOrder: state => state.posMachine.currentOrder,
        selectedCategory: state => state.posMachine.selectedCategory,
        unsavedOrderProduct: state => state.posMachine.unsavedOrderProduct,
        isAllOrderProductDone: state => {
          const temp = state.posMachine.savedOrderProduct.filter(
            item => item.orderProductStatus === OrderProductStatus.value.PREPARING);
          return temp.length === 0;
        },
      }),
    },
    data() {
      return {
        isLoading: false,
        orderStatusValue: OrderStatus.value
      };
    },
    methods: {
      cancelOrder() {
        this.$refs.cancelOrderDialog.show();
      },
      async receiveOrder() {
        try {
          this.isLoading = true;
          await this.$store.dispatch('posMachine/receiveOrder');
          this.isLoading = false;
        } catch (error) {
          this.isLoading = false;
          ErrorUtils.showErrorMessage(error);
        }
      },
      async updateOrder() {
        try {
          this.isLoading = true;
          await this.$store.dispatch('posMachine/updateOrder');
          this.isLoading = false;
        } catch (error) {
          this.isLoading = false;
          const errorMsg = error.message || error.data.message;
          if (errorMsg === ErrorCode.value.STORE_PRODUCT_STOP_TRADING) {
            this.refreshStoreProduct();
          }
          ErrorUtils.showErrorMessage(error);
        }
      },
      async refreshStoreProduct() {
        try {
          await this.$store.dispatch('posMachine/getAllCategory', this.$route.params.storeGuid);
          await this.$store.dispatch('posMachine/changeCategory', this.selectedCategory.guid);
        } catch (error) {
          ErrorUtils.showErrorMessage(error);
        }
      },
      async serveAllOrderProduct() {
        try {
          this.isLoading = true;
          await this.$store.dispatch('posMachine/serveAllOrderProduct');
          this.isLoading = false;
        } catch (error) {
          this.isLoading = false;
          ErrorUtils.showErrorMessage(error);
        }
      },
    },
  };
</script>

<style scoped>

</style>
