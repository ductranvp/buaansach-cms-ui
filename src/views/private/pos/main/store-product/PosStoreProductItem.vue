<template>
  <el-card v-loading="storeProduct.isLoading" class="pointer"
           style="position: relative"
           :body-style="{ padding: '0px' }"
           shadow="never">
    <div style="position: relative"
         :class="storeProduct.storeProductStatus === storeProductStatus.UNAVAILABLE ? 'pointer-disabled' : ''">
      <el-image
              :class="[storeProduct.storeProductStatus === storeProductStatus.UNAVAILABLE ? 'grayscale' : '',
              imageClasses[imageSize]]"
              @click.native="addOrderProduct(storeProduct)" :src="getMediaUrl(storeProduct.productThumbnailUrl)"
              class="store-product-image">
        <div slot="error" class="image-error-slot" :class="imageClasses[imageSize]">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
      <div v-if="storeProduct.storeProductStatus === storeProductStatus.UNAVAILABLE"
           style="position: relative; margin-top:-32px">
        <el-tag class="full-width no-border-radius text-center" type="danger" style="height: 32px">
          <span>Hết Hàng</span>
        </el-tag>
      </div>
    </div>
    <el-divider class="full-width margin-0"></el-divider>
    <div @click="addOrderProduct(storeProduct)" class="padding-5 text-small"
         :class="storeProduct.storeProductStatus === storeProductStatus.UNAVAILABLE ? 'pointer-disabled' : ''">
      <div class="text-mini">{{storeProduct.productCode}}</div>
      <div class="text-mini">{{storeProduct.productPrice | priceAppend}}</div>
      <div class="text-bold text-two-line">
        <el-tooltip class="item" effect="dark" :content="storeProduct.productName" placement="top-start">
          <span>{{storeProduct.productName}}</span>
        </el-tooltip>
      </div>
    </div>

    <div style="position: absolute; top: 0; right: 0">
      <el-dropdown trigger="click" placement="bottom-start">
        <el-button class="padding-5-10" type="warning" size="mini" title="Sửa trạng thái">
          <i class="fas el-icon-fa-edit margin-0"></i>
        </el-button>
        <el-dropdown-menu class="padding-0" slot="dropdown">
          <el-dropdown-item v-if="storeProduct.storeProductStatus === storeProductStatus.AVAILABLE"
                            @click.native="changeStoreProductStatus(storeProduct, storeProductStatus.UNAVAILABLE)">
            <span>Hết hàng</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="changeStoreProductStatus(storeProduct, storeProductStatus.AVAILABLE)"
                            v-else>
            <span>Đã có hàng</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

  </el-card>
</template>

<script>
  import MessageUtils from '@/utils/message.util';
  import ErrorUtils from '@/utils/error.util';
  import {mapState} from 'vuex';
  import StoreProductStatus from '@/enum/StoreProductStatus';
  import OrderStatus from '@/enum/OrderStatus';

  export default {
    name: 'PosStoreProductItem',
    computed: {
      ...mapState({
        displayStoreProducts: state => state.posMachine.displayStoreProducts,
        selectedCategory: state => state.posMachine.selectedCategory,
        selectedSeat: state => state.posMachine.selectedSeat,
        currentOrder: state => state.posMachine.currentOrder,
        allCategories: state => state.posMachine.allCategories,
      }),
    },
    props: {
      storeProduct: {
        type: Object,
        required: true
      },
      imageSize: {
        type: Number,
        default: 1
      }
    },
    data(){
      return {
        orderStatus: OrderStatus.value,
        storeProductStatus: StoreProductStatus.value,
        imageClasses: {
          1: 'image-size-1',
          2: 'image-size-2',
        },
      };
    },
    methods: {
      addOrderProduct(storeProduct) {
        if (!this.selectedSeat.guid) {
          MessageUtils.error('Vui lòng chọn một bàn ăn!');
          return;
        }
        if (!this.currentOrder.guid) {
          MessageUtils.error('Vui lòng tạo đơn trước khi chọn món!');
          return;
        }
        if (this.currentOrder.orderStatus === this.orderStatus.CREATED) {
          MessageUtils.error('Vui lòng tiếp nhận đơn trước khi thêm món!');
          return;
        }
        if (storeProduct.storeProductStatus === this.storeProductStatus.UNAVAILABLE) {
          MessageUtils.error('Không thể thêm sản phẩm đã hết hàng!');
          return;
        }
        this.$store.dispatch('posMachine/addOrderProduct', storeProduct);
      },
      async changeStoreProductStatus(storeProduct, storeProductStatus) {
        const payload = {
          storeProductGuid: storeProduct.guid,
          storeProductStatus: storeProductStatus,
        };
        try {
          this.$set(storeProduct, 'isLoading', true);
          await this.$store.dispatch('posMachine/changeStoreProductStatus', payload);
        } catch (error) {
          ErrorUtils.showActionErrorMessage(error);
        } finally {
          this.$set(storeProduct, 'isLoading', false);
        }
      },
    }
  };
</script>

<style scoped>
  .el-card {
    box-sizing: border-box;
    border: 1px solid #bbb;
  }

  .store-product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .grayscale {
    filter: grayscale(100%);
  }

  /deep/.image-size-1 {
    min-height: 90px;
  }

  /deep/.image-size-2 {
    min-height: 140px;
  }
</style>