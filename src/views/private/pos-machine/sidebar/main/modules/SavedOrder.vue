<template>
  <div id="saved_order">
    <el-card :body-style="{padding: '10px 0px'}" shadow="never"
             v-for="(item) in savedOrderProduct"
             :key="item.guid">
      <el-row type="flex" align="middle" style="height: 48px">
        <div class="text-bold text-very-large padding-0-20">{{item.orderProductQuantity}}</div>
        <el-row class="full-size" type="flex" align="middle">
          <el-col :span="8" class="text-small">
            <span>{{item.productName}}</span><br>
            <span>{{item.orderProductPrice | priceAppend}}</span>
          </el-col>
          <el-col :span="6">
            <span class="text-bold padding-left-10">{{(item.orderProductPrice * item.orderProductQuantity) | priceAppend}}</span>
          </el-col>
          <template v-if="currentOrder.orderStatus !== 'CREATED'">
            <el-col :span="10" class="padding-left-10 text-right">
              <template v-if="item.orderProductStatus === 'PREPARING'">
                <el-row type="flex" align="middle" justify="end">
                  <el-button @click="serveOrderProduct(item)" type="success" size="small">Xong</el-button>
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
        <el-button
          v-if="item.orderProductStatus !== 'SERVED' &&
          item.orderProductStatus.indexOf('CANCELLED') === -1 &&
          currentOrder.orderStatus !== 'CREATED'"
          @click="cancelOrderProduct(item)" type="text"
          class="padding-10 text-info text-very-large">
          <i class="el-icon-close"></i>
        </el-button>
      </el-row>
      <el-row v-if="item.orderProductNote" type="flex" align="middle" class="full-size padding-0-10">
        <el-tag type="info" class="order-note">
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
  import NotificationUtils from "@/utils/notification.util";
  import MessageUtils from "@/utils/message.util";

  export default {
    name: "SavedOrder",
    computed: {
      ...mapState({
        selectedSeat: state => state.posMachine.selectedSeat,
        currentOrder: state => state.posMachine.currentOrder,
        savedOrderProduct: state => state.posMachine.savedOrderProduct,
        orderProductStatus: state => state.posMachine.orderProductStatus,
      })
    },
    methods: {
      async serveOrderProduct(product) {
        const vm = this;
        if (vm.$route.params.storeGuid) {
          try {
            await vm.$store.dispatch("posMachine/serveOrderProduct",
              {orderProduct: product, storeGuid: vm.$route.params.storeGuid});
            NotificationUtils.success("Cập nhật thành công", 1000);
          } catch (error) {
            NotificationUtils.error("Đã xảy ra lỗi, vui lòng thử lại");
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
            if (vm.$route.params.storeGuid)
              vm.$store.dispatch("posMachine/cancelOrderProduct",
                {
                  orderProduct: product,
                  cancelReason: cb.value,
                  storeGuid: vm.$route.params.storeGuid
                });
          } else {
            MessageUtils.error("Bạn phải nhập lí do hủy đơn");
          }
        });
      },
    }
  };
</script>

<style scoped>
  .order-note {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
