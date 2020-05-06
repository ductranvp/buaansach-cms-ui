<template>
  <el-main class="full-size">
    <el-container class="full-size" direction="vertical">
      <el-main v-if="selectedSeat.guid" class="scroll full-size show-vertical-scroll">

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
                    <span>{{item.orderProductPrice | priceAppend("₫")}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span class="text-bold padding-left-10">{{(item.orderProductPrice * item.orderProductQuantity) | priceAppend("₫")}}</span>
                  </el-col>
                  <el-col :span="10" class="padding-left-10 text-right">
                    <template v-if="item.orderProductStatus === 'PREPARING'">
                      <el-row type="flex" align="middle" justify="end">
                        <el-button @click="serveOrderProduct(item)" type="success" size="small">Đã phục vụ</el-button>
                      </el-row>
                    </template>
                    <el-tag class="margin-right-10" type="success" v-else-if="item.orderProductStatus === 'SERVED'">
                      <span>Hoàn tất</span>
                    </el-tag>
                    <el-tag class="margin-right-10" type="danger" v-else>
                      <span>Đã hủy</span>
                    </el-tag>
                  </el-col>
                </el-row>
                <el-button
                  v-if="item.orderProductStatus !== 'SERVED' && item.orderProductStatus.indexOf('CANCELLED') === -1"
                  @click="cancelOrderProduct(item)" type="text"
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
                <div class="pointer text-bold text-very-large">
                  <el-popover
                    v-model="item.popoverVisible"
                    placement="right"
                    width="150"
                    @after-enter="onPopoverShow(item.productGuid)"
                    trigger="click">
                    <el-form onsubmit="return false">
                      <el-form-item class="margin-0">
                        <el-input @keypress.enter.native="updateOrderProductQuantity(item)"
                                  :ref="item.productGuid"
                                  size="mini" v-model="orderProductQuantity"
                                  :value="item.orderProductQuantity"></el-input>

                      </el-form-item>
                      <el-form-item class="margin-0">
                        <el-row :gutter="10" type="flex">
                          <el-col>
                            <el-button class="full-width" size="mini" @click="item.popoverVisible = false">
                              <span>Hủy</span>
                            </el-button>
                          </el-col>
                          <el-col>
                            <el-button class="full-width" size="mini" type="primary"
                                       @click="updateOrderProductQuantity(item)">
                              <span>OK</span>
                            </el-button>
                          </el-col>
                        </el-row>
                      </el-form-item>
                    </el-form>
                    <span class="order-quantity padding-0-20" slot="reference" @click="setOrderProductQuantity(item)">{{item.orderProductQuantity}}</span>
                  </el-popover>
                </div>
                <el-row class="full-size" type="flex" align="middle">
                  <el-col :span="8" class="text-small">
                    <span>{{item.productName}}</span><br>
                    <span>{{item.orderProductPrice | priceAppend("₫")}}</span>
                  </el-col>
                  <el-col :span="8">
                    <span class="text-bold padding-left-10">{{(item.orderProductPrice * item.orderProductQuantity) | priceAppend("₫")}}</span>
                  </el-col>
                  <el-col :span="8" class="padding-left-10 text-right">
                    <el-tag type="info">Chưa lưu</el-tag>
                  </el-col>
                </el-row>
                <el-button @click="removeUnsavedOrderProduct(item)" type="text"
                           class="padding-10 text-info text-very-large">
                  <i class="el-icon-close"></i>
                </el-button>
              </el-row>
            </el-card>
          </div>
        </div>

        <!--show when order is not created -->
        <div v-else class="full-size">
          <el-row class="full-size" type="flex" align="middle" justify="center">
            <el-form ref="createOrderForm" :model="form" :rules="formRules">
              <el-form-item prop="customerPhone">
                <input-label label="SĐT khách hàng" optional/>
                <el-input v-model="form.customerPhone"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button class="full-width" type="warning" @click="createOrder"  :loading="isLoading">Tạo đơn
                </el-button>
              </el-form-item>
            </el-form>
          </el-row>
        </div>

      </el-main>

      <!--show when seat is not selected -->
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
  import mixinMethod from "@/views/private/pos-machine/sidebar/modules/main/main-body.method";

  export default {
    name: "MainBody",
    mixins: [mixinMethod],
    computed: {
      ...mapState({
        selectedSeat: state => state.posMachine.selectedSeat,
        currentOrder: state => state.posMachine.currentOrder,
        savedOrderProduct: state => state.posMachine.savedOrderProduct,
        unsavedOrderProduct: state => state.posMachine.unsavedOrderProduct,
      })
    },
    data() {
      return {
        isLoading: false,
        form: {
          seatGuid: null,
          customerPhone: null,
          recreateFromOrderGuid: null,
        },
        formRules: {
          customerPhone: [
            {
              pattern: "^(09|03|07|08|05)+([0-9]{8})$",
              message: "Số điện thoại không hợp lệ",
              trigger: "blur"
            }
          ]
        },
        popoverVisible: false,
        orderProductQuantity: null,
      };
    },
    watch: {
      currentOrder: function () {
        if (!this.currentOrder.guid) this.resetForm();
      },
      unsavedOrderProduct: function () {
        this.scrollToEnd();
      },
    },
    // updated() {
    //   this.scrollToEnd();
    // },
    methods: {
      resetForm() {
        this.form = {};
      },
      scrollToEnd() {
        let container = document.querySelector(".scroll");
        let scrollHeight = container.scrollHeight;
        container.scrollTop = scrollHeight;
      },
    }
  };
</script>

<style scoped>
  .order-quantity:focus {
    outline: 0;
  }
</style>
