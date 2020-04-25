<template>
  <el-main class="full-size">
    <el-container class="full-size" direction="vertical">
      <el-main v-if="selectedSeat.guid" class="full-size">
        <div v-if="currentOrder.guid" class="full-size">
          <div id="saved_order">
            <el-card :body-style="{padding: '10px 0px'}" shadow="never"
                     v-for="(item) in savedOrderProduct"
                     :key="item.guid">
              <el-row type="flex" align="middle">
                <div class="text-bold text-very-large padding-0-20">{{item.orderProductQuantity}}</div>
                <el-row class="full-size" type="flex" align="middle">
                  <el-col :span="8" class="text-small">
                    <span>{{item.productName}}</span><br>
                    <span>{{item.orderProductPrice | price}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span class="text-bold padding-left-10">{{(item.orderProductPrice * item.orderProductQuantity) | price}}</span>
                  </el-col>
                  <el-col :span="10" class="padding-left-10 text-right">
                    <template v-if="item.orderProductStatus === 'PREPARING'">
                      <el-row type="flex" align="middle" justify="end">
                        <el-button @click="updateOrderProduct(item)" type="success" size="small">Đã phục vụ</el-button>
                      </el-row>
                    </template>
                    <el-tag type="warning" v-else-if="item.orderProductStatus === 'SERVED'">
                      <span>Hoàn tất</span>
                    </el-tag>
                    <el-tag type="warning" v-else>
                      <span>Đã hủy</span>
                    </el-tag>
                  </el-col>
                </el-row>
                <el-button @click="cancelOrderProduct(item)" type="text"
                           class="padding-10 text-info text-very-large">
                  <i class="el-icon-close"></i>
                </el-button>
              </el-row>
            </el-card>
          </div>
          <div id="unsaved_order">
            <el-card :body-style="{padding: '10px 0px'}" shadow="never"
                     v-for="(item) in unsavedOrderProduct"
                     :key="item.guid">
              <el-row type="flex" align="middle">
                <div class="text-bold text-very-large padding-0-20">{{item.orderProductQuantity}}</div>
                <el-row class="full-size" type="flex" align="middle">
                  <el-col :span="8" class="text-small">
                    <span>{{item.productName}}</span><br>
                    <span>{{item.orderProductPrice | price}}</span>
                  </el-col>
                  <el-col :span="8">
                    <span class="text-bold padding-left-10">{{(item.orderProductPrice * item.orderProductQuantity) | price}}</span>
                  </el-col>
                  <el-col :span="8" class="padding-left-10 text-right">
                    <el-tag type="info">Chưa lưu</el-tag>
                  </el-col>
                </el-row>
                <el-button @click="removeOrderProduct(item)" type="text"
                           class="padding-10 text-info text-very-large">
                  <i class="el-icon-close"></i>
                </el-button>
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
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: "MainBody",
    computed: {
      ...mapState({
        selectedSeat: state => state.posMachine.selectedSeat,
        currentOrder: state => state.posMachine.currentOrder,
        savedOrderProduct: state => state.posMachine.savedOrderProduct,
        unsavedOrderProduct: state => state.posMachine.unsavedOrderProduct,
      })
    },
    methods: {
      createOrder() {
        this.$store.dispatch("posMachine/createOrder", this);
      },
      updateOrderProduct(product) {

      },
      cancelOrderProduct(product) {

      },
      removeOrderProduct(product) {

      }
    }
  };
</script>

<style scoped>

</style>
