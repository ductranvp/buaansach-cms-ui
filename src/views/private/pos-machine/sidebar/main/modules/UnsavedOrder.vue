<template>
  <div id="unsaved_order" class="padding-bottom-10">
    <el-card :body-style="{padding: '15px 0px'}" shadow="never"
             class="no-border-radius item-card"
             v-for="(item) in unsavedOrderProduct"
             :key="item.guid">
      <!--Main-->
      <el-row type="flex" align="middle" style="height: 50px">
        <div class="pointer text-bold text-very-large padding-0-20">
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
            <span class="order-quantity" slot="reference" @click="setOrderProductQuantity(item)">
              <el-tooltip content="Bấm để sửa">
                <span>{{item.orderProductQuantity}}</span>
              </el-tooltip>
            </span>
          </el-popover>
        </div>
        <el-row class="full-size" type="flex" align="middle">
          <el-col style="line-height: 20px">
            <div class="text-bold text-medium">{{item.productName}}</div>
            <div class="text-mini">
              <i class="el-icon-close"></i>
              <span>{{item.orderProductPrice | priceAppend}}</span>
              <span> = </span>
              <span>{{(item.orderProductPrice * item.orderProductQuantity) | priceAppend}}</span>
            </div>
          </el-col>
          <div class="padding-left-10">
            <el-tag type="info">Chưa lưu</el-tag>
          </div>
        </el-row>
        <el-tooltip content="Xóa món ăn">
          <el-button @click="removeUnsavedOrderProduct(item)" type="text"
                     class="padding-10 text-info text-very-large">
            <i class="el-icon-close"></i>
          </el-button>
        </el-tooltip>
      </el-row>
      <!--Note-->
      <el-row type="flex" align="bottom" style="margin-bottom: -15px;">
        <div>
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

            <el-button class="no-border-radius no-border" type="warning" plain slot="reference" size="mini"
                       @click="setOrderProductNote(item)">
              <i class="fas el-icon-fa-edit"></i>
              <span>Ghi chú</span>
            </el-button>
          </el-popover>
        </div>
        <el-col class="full-height">
          <el-tag class="no-border no-border-radius full-size" v-if="item.orderProductNote" type="warning"
                  size="medium">{{item.orderProductNote}}
          </el-tag>
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

<style lang="scss" scoped>
  .order-quantity:focus {
    outline: 0;
  }

  .item-card {
    border-top: none;
    border-right: none;
    border-left: none;
    border-bottom: 1px solid $--color-border;
  }
</style>
