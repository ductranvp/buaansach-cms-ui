<template>
  <el-main class="full-size">
    <el-container class="full-size" direction="vertical">
      <el-header class="bg-yellowgreen" height="40px">
        <el-row class="full-size" type="flex" align="middle" justify="center">
          <el-col>
            <span>Giờ vào: {{currentOrder.createdDate | moment("HH:mm")}}</span>
          </el-col>
          <el-dropdown trigger="click" class="padding-right-10">
            <el-button type="success" size="mini">
              <i class="el-icon-menu"></i>
              <span>Tùy chọn</span>
            </el-button>
            <el-dropdown-menu class="padding-0" slot="dropdown">
              <el-dropdown-item command="moveOrder">
                <span>Chuyển bàn</span>
              </el-dropdown-item>
              <el-dropdown-item command="orderHistory">
                <span>Lịch sử</span>
              </el-dropdown-item>
              <el-dropdown-item @click.native="cancelOrder">
                <span>Hủy đơn</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-row>
      </el-header>
      <el-main class="full-size">
        <el-container class="full-size" direction="vertical">
          <el-main v-if="selectedSeat.guid" class="full-size">
            <div v-if="currentOrder.guid" class="full-size">
              <div>
                <el-card shadow="never" v-for="(item) in savedOrderProduct" :key="item.productGuid">
                  <el-row type="flex" align="middle">
                    <el-col :span="3">
                      <el-row type="flex" align="middle">
                        <span class="text-bold">{{item.orderProductQuantity}}</span>
                      </el-row>
                    </el-col>
                    <el-col :span="8">
                      <span>{{item.productName}}</span><br>
                      <span>{{item.productCode}}</span>
                    </el-col>
                    <el-col :span="4">
                      <span>{{item.orderProductPrice * item.orderProductQuantity}}</span>
                    </el-col>
                    <el-col :span="6">
                      <el-tag>{{item.orderProductStatus}}</el-tag>
                    </el-col>
                    <el-col :span="3" class="text-center">
                      <el-button type="danger" size="small" plain>
                        <i class="el-icon-close"></i>
                      </el-button>
                    </el-col>
                  </el-row>
                </el-card>
              </div>
              <div>
                <el-card shadow="never" v-for="(item) in unsavedOrderProduct" :key="item.productGuid">
                  <el-row type="flex" align="middle">
                    <el-col :span="3">
                      <el-row type="flex" align="middle">
                        <span class="text-bold">{{item.orderProductQuantity}}</span>
                      </el-row>
                    </el-col>
                    <el-col :span="8">
                      <span>{{item.productName}}</span><br>
                      <span>{{item.productCode}}</span>
                    </el-col>
                    <el-col :span="4">
                      <span>{{item.orderProductPrice * item.orderProductQuantity}}</span>
                    </el-col>
                    <el-col :span="3" class="text-center">
                      <el-button type="danger" size="small" plain>
                        <i class="el-icon-close"></i>
                      </el-button>
                    </el-col>
                  </el-row>
                </el-card>
              </div>
            </div>

            <div v-else class="full-size">
              <el-row class="full-size" type="flex" align="middle" justify="center">
                <el-button type="warning" @click="createOrder">Tạo đơn</el-button>
              </el-row>
            </div>

          </el-main>

          <el-main v-else class="full-size">
            <el-row class="full-size" type="flex" justify="center" align="middle">
              <el-col :span="18">
                <el-alert :closable="false" center effect="dark" type="warning">
                  <span slot="title">Hãy chọn 1 bàn ăn</span>
                </el-alert>
              </el-col>
            </el-row>
          </el-main>
        </el-container>
      </el-main>
      <el-divider class="margin-0"></el-divider>
      <el-footer height="40px">
        <el-row class="full-size padding-0-10" type="flex" align="middle" v-if="currentOrder.guid">
          <el-col>
            <el-button type="info" class="full-width" @click="saveOrder" size="small">Lưu đơn hàng</el-button>
          </el-col>
        </el-row>
      </el-footer>
    </el-container>
  </el-main>
</template>

<script>
  import {mapState} from "vuex";
  import MessageUtils from "@/utils/message.util";

  export default {
    name: "PosSidebarMain",
    computed: {
      ...mapState({
        selectedSeat: state => state.posMachine.selectedSeat,
        currentOrder: state => state.posMachine.currentOrder,
        savedOrderProduct: state => state.posMachine.savedOrderProduct,
        unsavedOrderProduct: state => state.posMachine.unsavedOrderProduct,
      })
    },
    data() {
      return {};
    },
    methods: {
      createOrder() {
        this.$store.dispatch("posMachine/createOrder", this);
      },
      cancelOrder() {
        const vm = this;
        this.$prompt("Nhập lí do hủy đơn (bắt buộc)", "Xác nhận hủy đơn", {
          confirmButtonText: 'Hủy đơn',
          cancelButtonText: 'Đóng',
          inputType: 'textarea'
        }).then(cb => {
          if (cb.value) {
            vm.$store.dispatch("posMachine/cancelOrder", {vm: vm, cancelReason: cb.value});
          } else {
            MessageUtils.error("Bạn phải nhập lí do hủy đơn");
          }
        });
      },
      saveOrder() {
        this.$store.dispatch("posMachine/saveOrder", this);
      }
    }
  };
</script>

<style scoped>
  .icon-button {
    padding: 0;
    height: 28px;
    width: 28px;
    font-size: 20px
  }
</style>
