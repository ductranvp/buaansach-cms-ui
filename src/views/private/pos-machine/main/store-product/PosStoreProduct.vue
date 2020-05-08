<template>
  <el-container class="full-size" direction="vertical">
    <el-header class="bg-yellowgreen" height="40px">
      <el-row class="full-size" type="flex" align="middle">
        <el-col class="padding-0-5">
          <el-autocomplete
            ref="filterStoreProduct"
            size="mini"
            v-model="filterStoreProduct"
            :fetch-suggestions="queryStoreProduct"
            placeholder="Mã hoặc tên sản phẩm"
            :debounce="filterDebounce"
            :trigger-on-focus="false">
          </el-autocomplete>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="show-vertical-scroll full-size padding-left-5 padding-right-5 padding-top-10">
      <el-row :gutter="10" v-loading="isLoading" class="full-size flex-wrap margin-0">
        <el-col v-for="storeProduct in filterStoreProduct ? filteredStoreProducts : displayStoreProducts"
                class="margin-bottom-10"
                :span="4"
                :key="storeProduct.guid">
          <el-card class="pointer"
                   :body-style="{ padding: '0px' }"
                   @click.native="addOrderProduct(storeProduct)"
                   shadow="never">
            <img :src="storeProduct.productImageUrl" class="store-product-image">
            <el-divider class="full-width margin-0"></el-divider>
            <div class="padding-5 text-small">
              <div>{{storeProduct.productCode}}</div>
              <div class="text-bold text-single-line">
                <el-tooltip class="item" effect="dark" :content="storeProduct.productName" placement="top-start">
                  <span>{{storeProduct.productName}}</span>
                </el-tooltip>
              </div>
              <div>{{storeProduct.productPrice | priceAppend}}</div>
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
      })
    },
    data() {
      return {
        isLoading: false,
        filterDebounce: 400,
        filterStoreProduct: "",
        filteredStoreProducts: [],
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
      addOrderProduct(storeProduct) {
        if (this.selectedSeat.guid && this.currentOrder.guid) {
          this.$store.dispatch("posMachine/addOrderProduct", {storeProduct: storeProduct});
        } else {
          if (this.selectedSeat.guid) {
            MessageUtils.error("Vui lòng tạo đơn trước khi chọn món!");
          } else {
            MessageUtils.error("Vui lòng chọn một bàn ăn!");
          }
        }
      },
      changeDisplayStoreProductSize(value) {
        localStorage.setItem("displayStoreProductSize", value);
      },
      queryStoreProduct(keyword, cb) {
        keyword = keyword.trim();
        this.filteredStoreProducts = this.displayStoreProducts
          .filter(storeProduct => storeProduct.productCode.toLowerCase().search(keyword) !== -1 || storeProduct.productName.toLowerCase().search(keyword) !== -1);
        this.isLoading = false;
        cb([]);
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
    height: 100px;
    display: block;
  }
</style>
