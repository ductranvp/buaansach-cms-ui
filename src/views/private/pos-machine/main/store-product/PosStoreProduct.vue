<template>
  <el-container class="full-size" direction="vertical" v-loading="isLoading || isRefreshing">
    <el-header class="bg-yellowgreen" height="40px">
      <el-row class="full-size" type="flex" align="middle">
        <el-col :span="16" class="padding-0-5">
          <el-autocomplete
            ref="filterStoreProduct"
            size="mini"
            v-model="filterStoreProduct"
            :fetch-suggestions="queryStoreProduct"
            placeholder="Mã hoặc tên sản phẩm"
            :debounce="filterDebounce"
            prefix-icon="el-icon-search"
            :trigger-on-focus="false">
          </el-autocomplete>
        </el-col>
        <el-col :span="8">
          <el-row type="flex" align="middle">
            <el-button class="bg-yellowgreen no-border">
              <span><span>Mật độ</span></span>
            </el-button>
            <el-col>
              <el-slider
                v-model="itemSize"
                :step="1"
                :min="1"
                :max="3"
                show-stops>
              </el-slider>
            </el-col>
          </el-row>
        </el-col>
        <div class="text-right padding-right-5">
          <el-button class="bg-yellowgreen no-border" :loading="isRefreshing" size="mini" @click="refreshStoreProduct">
            <span><i class="el-icon-refresh" v-if="!isRefreshing"></i><span>Làm mới</span></span>
          </el-button>
        </div>
      </el-row>
    </el-header>
    <el-main class="show-vertical-scroll full-size padding-left-5 padding-right-5 padding-top-10">
      <el-row :gutter="10" class="full-size flex-wrap margin-0">
        <el-col v-for="storeProduct in filterStoreProduct ? filteredStoreProducts : displayStoreProducts"
                class="margin-bottom-10"
                :span="sizeOptions[itemSize]"
                :key="storeProduct.guid">
          <el-card v-loading="storeProduct.isLoading" class="pointer"
                   style="position: relative"
                   :body-style="{ padding: '0px' }"
                   shadow="never">
            <div style="position: relative"
                 :class="storeProduct.storeProductStatus === 'UNAVAILABLE' ? 'pointer-disabled' : ''">
              <el-image
                :class="[storeProduct.storeProductStatus === 'UNAVAILABLE' ? 'grayscale' : '', imageClasses[itemSize]]"
                @click.native="addOrderProduct(storeProduct)" :src="storeProduct.productThumbnailUrl"
                class="store-product-image">
                <div slot="error" class="image-error-slot full-size">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <div v-if="storeProduct.storeProductStatus === 'UNAVAILABLE'"
                   style="position: relative; margin-top:-32px">
                <el-tag class="full-width no-border-radius text-center" type="danger" style="height: 32px">
                  <span>Tạm Hết Hàng</span>
                </el-tag>
              </div>
            </div>
            <el-divider class="full-width margin-0"></el-divider>
            <div @click="addOrderProduct(storeProduct)" class="padding-5 text-small"
                 :class="storeProduct.storeProductStatus === 'UNAVAILABLE' ? 'pointer-disabled' : ''">
              <div>{{storeProduct.productCode}}</div>
              <div class="text-bold text-single-line">
                <el-tooltip class="item" effect="dark" :content="storeProduct.productName" placement="top-start">
                  <span>{{storeProduct.productName}}</span>
                </el-tooltip>
              </div>
              <div>{{storeProduct.productPrice | priceAppend}}</div>
            </div>

            <div style="position: absolute; top: 0; right: 0">
              <el-dropdown trigger="click" placement="bottom-start">
                <el-button class="padding-5-10 no-border-radius" type="info" size="mini" title="Sửa trạng thái">
                  <i class="fas el-icon-fa-edit"></i>
                </el-button>
                <el-dropdown-menu class="padding-0" slot="dropdown">
                  <el-dropdown-item v-if="storeProduct.storeProductStatus === 'AVAILABLE'"
                                    @click.native="changeStoreProductStatus(storeProduct, 'UNAVAILABLE')">
                    <span>Hết hàng</span>
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="changeStoreProductStatus(storeProduct, 'AVAILABLE')" v-else>
                    <span>Đã có hàng</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>

          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
  import {mapState} from "vuex";
  import MessageUtils from "@/utils/message.util";

  export default {
    name: "PosStoreProduct",
    computed: {
      ...mapState({
        displayStoreProducts: state => state.posMachine.displayStoreProducts,
        selectedCategory: state => state.posMachine.selectedCategory,
        selectedSeat: state => state.posMachine.selectedSeat,
        currentOrder: state => state.posMachine.currentOrder,
        orderStatus: state => state.posMachine.orderStatus,
      })
    },
    data() {
      return {
        isRefreshing: false,
        isLoading: false,
        filterDebounce: 400,
        filterStoreProduct: "",
        filteredStoreProducts: [],
        itemSize: 2,
        sizeOptions: {
          1: 3,
          2: 4,
          3: 6,
        },
        imageClasses: {
          1: "image-height-1",
          2: "image-height-2",
          3: "image-height-3",
        }
      };
    },
    watch: {
      selectedCategory: function () {
        this.filterStoreProduct = "";
      },
      filterStoreProduct: function (val) {
        this.isLoading = val;
      }
    },
    methods: {
      async refreshStoreProduct() {
        const vm = this;
        try {
          vm.isRefreshing = true;
          await vm.$store.dispatch("posMachine/getAllCategory", vm.$route.params.storeGuid);
          await vm.$store.dispatch("posMachine/changeCategory", vm.selectedCategory.guid);
          setTimeout(function () {
            vm.isRefreshing = false;
          }, 300);
        } catch (e) {
          MessageUtils.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
        }
      },
      addOrderProduct(storeProduct) {
        if (!this.selectedSeat.guid) {
          MessageUtils.error("Vui lòng chọn một bàn ăn!");
          return;
        }
        if (!this.currentOrder.guid) {
          MessageUtils.error("Vui lòng tạo đơn trước khi chọn món!");
          return;
        }
        if (this.currentOrder.orderStatus === this.orderStatus.CREATED) {
          MessageUtils.error("Vui lòng tiếp nhận đơn trước khi thêm món!");
          return;
        }
        if (storeProduct.storeProductStatus === 'UNAVAILABLE') {
          MessageUtils.error("Không thể thêm sản phẩm đã hết hàng!");
          return;
        }
        this.$store.dispatch("posMachine/addOrderProduct", {storeProduct: storeProduct});
      },
      queryStoreProduct(keyword, cb) {
        keyword = keyword.trim();
        this.filteredStoreProducts = this.displayStoreProducts
          .filter(storeProduct => storeProduct.productCode.toLowerCase().search(keyword) !== -1 || storeProduct.productName.toLowerCase().search(keyword) !== -1);
        this.isLoading = false;
        cb([]);
      },
      async changeStoreProductStatus(storeProduct, storeProductStatus) {
        const payload = {
          storeProductGuid: storeProduct.guid,
          storeProductStatus: storeProductStatus,
        };
        try {
          this.$set(storeProduct, "isLoading", true);
          await this.$store.dispatch("posMachine/changeStoreProductStatus", payload);
          this.$set(storeProduct, "isLoading", false);
        } catch (e) {
          this.$set(storeProduct, "isLoading", false);
          MessageUtils.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
        }
      }
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
    object-fit: cover;
    display: block;
  }

  .image-height-1 {
    height: 72px;
  }

  .image-height-2 {
    height: 100px;
  }

  .image-height-3 {
    height: 168px;
  }

  .grayscale {
    filter: grayscale(100%);
  }
</style>
