<template>
  <div id="saved_order">
    <el-card :body-style="{position: 'relative', padding: '12px 0px'}" shadow="never"
             v-for="(item) in savedOrderProduct"
             :class="item.orderProductGroup === activeOrderProductGroup ? 'is-highlight' : ''"
             :key="item.guid">
      <el-tag style="position: absolute; top: 0; left:0" size="mini" type="info" class="no-border-radius">
        <el-tooltip :content="$moment(item.createdDate).format('HH:mm:ss - DD/MM/YYYY')">
          <span>{{item.createdDate | moment("HH:mm:ss")}}</span>
        </el-tooltip>
      </el-tag>
      <el-row type="flex" align="middle" style="height: 48px">
        <div class="text-bold text-very-large padding-0-20">{{item.orderProductQuantity}}</div>
        <el-row class="full-size" type="flex" align="middle">
          <el-col :span="8" class="text-small">
            <div>{{item.productName}}</div>
            <div>{{item.orderProductPrice | priceAppend}}</div>
          </el-col>
          <el-col :span="6">
            <span class="text-bold padding-left-10">{{(item.orderProductPrice * item.orderProductQuantity) | priceAppend}}</span>
          </el-col>
          <template v-if="currentOrder.orderStatus !== 'CREATED'">
            <el-col :span="10" class="padding-left-10 text-right">
              <template v-if="item.orderProductStatus === 'PREPARING'">
                <el-row type="flex" align="middle" justify="end">
                  <el-button :loading="item.isLoading" @click="serveOrderProduct(item)" type="success" size="small">Xong
                  </el-button>
                </el-row>
              </template>
              <el-button disabled plain class="margin-right-10" size="small" type="success"
                         v-else-if="item.orderProductStatus === 'SERVED'">
                <span>Đã phục vụ</span>
              </el-button>
              <el-button disabled plain class="margin-right-10" size="small" type="danger" v-else>
                <span>Đã hủy</span>
              </el-button>
            </el-col>
          </template>
        </el-row>
        <el-tooltip content="Hủy món ăn">
          <el-button
            v-if="item.orderProductStatus !== 'SERVED' &&
          item.orderProductStatus.indexOf('CANCELLED') === -1 &&
          currentOrder.orderStatus !== 'CREATED'"
            @click="cancelOrderProduct(item)" type="text"
            class="padding-10 text-info text-very-large">
            <i class="el-icon-close"></i>
          </el-button>
        </el-tooltip>

      </el-row>
      <el-row v-if="item.orderProductNote" type="flex" align="middle" class="full-size padding-top-5">
        <el-tag type="info" class="order-note" size="medium">
          <el-tooltip :content="item.orderProductNote">
            <span>Ghi chú: {{item.orderProductNote}}</span>
          </el-tooltip>
        </el-tag>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  import MessageUtils from "@/utils/message.util";

  export default {
    name: "SavedOrder",
    computed: {
      ...mapState({
        selectedSeat: state => state.posMachine.selectedSeat,
        currentOrder: state => state.posMachine.currentOrder,
        savedOrderProduct: state => state.posMachine.savedOrderProduct,
        orderProductStatus: state => state.posMachine.orderProductStatus,
        activeOrderProductGroup: state => state.posMachine.activeOrderProductGroup,
      })
    },
    data() {
      return {
        isLoading: false
      };
    },
    methods: {
      async serveOrderProduct(product) {
        const vm = this;
        if (vm.$route.params.storeGuid) {
          try {
            vm.$set(product, "isLoading", true);
            await vm.$store.dispatch("posMachine/serveOrderProduct",
              {orderProduct: product, storeGuid: vm.$route.params.storeGuid});
            vm.$set(product, "isLoading", false);
          } catch (error) {
            vm.$set(product, "isLoading", false);
            MessageUtils.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
          }
        }
      },
      cancelOrderProduct(product) {
        const vm = this;
        this.$prompt("Nhập lí do hủy món (bắt buộc)", "Hủy món", {
          confirmButtonText: 'Hủy món',
          cancelButtonText: 'Đóng',
          inputType: 'textarea'
        }).then(cb => {
          if (cb.value) {
            if (vm.$route.params.storeGuid) {
              try {
                const payload = {
                  orderProduct: product,
                  cancelReason: cb.value,
                  storeGuid: vm.$route.params.storeGuid
                };
                vm.$store.dispatch("posMachine/cancelOrderProduct", payload)
                  .then(() => {
                    vm.$store.dispatch("posMachine/getSeatOrderInfo", vm.selectedSeat.guid);
                  });
              } catch (e) {
                MessageUtils.error("Đã xảy ra lỗi, vui lòng thử lại sau");
              }
            }

          } else {
            MessageUtils.error("Bạn phải nhập lí do hủy đơn");
          }
        });
      },
    }
  };
</script>

<style lang="scss" scoped>
  .order-note {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  /deep/ .el-card {
    border-bottom: 0;
  }

  .is-highlight {
    background: $--color-warning-light;
  }
</style>
