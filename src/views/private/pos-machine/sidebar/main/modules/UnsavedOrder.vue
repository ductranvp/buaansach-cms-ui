<template>
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
            <span>{{item.orderProductPrice | priceAppend}}</span>
          </el-col>
          <el-col :span="8">
            <span class="text-bold padding-left-10">{{(item.orderProductPrice * item.orderProductQuantity) | priceAppend}}</span>
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
      <el-row type="flex" align="middle" class="padding-0-10">
        <div class="padding-right-10">
          <el-popover
            trigger="click"
            placement="right"
            width="150"
            @after-enter="onNotePopoverShow(item.productGuid + item.storeGuid)"
            v-model="item.notePopover">

            <el-form onsubmit="return false">
              <el-form-item class="margin-0">
                <el-input @keypress.enter.native="updateOrderProductNote(item)"
                          :ref="item.productGuid + '' + item.storeGuid"
                          size="mini"
                          v-model="orderProductNote">
                </el-input>

              </el-form-item>
              <el-form-item class="margin-0">
                <el-row :gutter="10" type="flex">
                  <el-col>
                    <el-button class="full-width" size="mini" @click="item.notePopover = false">
                      <span>Hủy</span>
                    </el-button>
                  </el-col>
                  <el-col>
                    <el-button class="full-width" size="mini" type="primary"
                               @click="updateOrderProductNote(item)">
                      <span>OK</span>
                    </el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>

            <el-button slot="reference" size="mini" @click="setOrderProductNote(item)">
              <i class="fas el-icon-fa-edit"></i>
              <span>Ghi chú</span>
            </el-button>
          </el-popover>
        </div>
        <el-col>
          <el-tag v-if="item.orderProductNote" type="info" size="medium">{{item.orderProductNote}}</el-tag>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: "UnsavedOrder",
    computed: {
      ...mapState({
        unsavedOrderProduct: state => state.posMachine.unsavedOrderProduct,
        orderProductStatus: state => state.posMachine.orderProductStatus,
      })
    },
    data() {
      return {
        orderProductNote: null,
        orderProductQuantity: null,
      };
    },
    methods: {
      removeUnsavedOrderProduct(product) {
        this.$store.commit("posMachine/REMOVE_UNSAVED_ORDER_PRODUCT", {orderProduct: product});
      },
      onPopoverShow(ref) {
        this.$refs[ref][0].focus();
        this.$refs[ref][0].select();
      },
      onNotePopoverShow(ref) {
        this.$refs[ref][0].focus();
        this.$refs[ref][0].select();
      },
      setOrderProductQuantity(orderProduct) {
        this.orderProductQuantity = orderProduct.orderProductQuantity;
      },
      updateOrderProductQuantity(orderProduct) {
        this.$store.commit("posMachine/SET_ORDER_PRODUCT_QUANTITY", {
          orderProduct: orderProduct,
          quantity: this.orderProductQuantity,
        });
        this.$set(orderProduct, 'popoverVisible', false);
      },
      setOrderProductNote(orderProduct) {
        this.orderProductNote = orderProduct.orderProductNote;
      },
      updateOrderProductNote(orderProduct) {
        this.$store.commit("posMachine/SET_ORDER_PRODUCT_NOTE", {
          orderProduct: orderProduct,
          note: this.orderProductNote,
        });
        this.$set(orderProduct, 'notePopover', false);
      }
    }
  };
</script>

<style scoped>
  .order-quantity:focus {
    outline: 0;
  }
</style>
