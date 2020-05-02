<template>
  <el-container class="full-size" direction="vertical">
    <el-header class="padding-0-10 bg-yellowgreen" height="42px">
      <el-row :gutter="10" class="full-size" type="flex" align="middle">
        <el-col :span="10">
          <el-autocomplete
            ref="filterStoreProduct"
            size="small"
            v-model="filterStoreProduct"
            :fetch-suggestions="queryStoreProduct"
            placeholder="Nhập mã hoặc tên sản phẩm (F4)"
            :debounce="filterDebounce"
            :trigger-on-focus="false">
          </el-autocomplete>
        </el-col>
        <el-col :span="8"></el-col>
        <el-col :span="6">
          <el-row :gutter="10" type="flex" align="middle">
            <div class="text-bold padding-right-10" style="white-space: nowrap;">Mật độ</div>
            <el-col>
              <el-slider
                v-model="displaySize"
                @change="changeDisplayStoreProductSize"
                :show-tooltip="false"
                show-stops
                :step="1"
                :min="1"
                :max="4">
              </el-slider>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="show-vertical-scroll full-size padding-left-5 padding-right-5 padding-top-10">
      <el-row :gutter="10" v-loading="isLoading" class="full-size flex-wrap margin-0">
        <el-col v-for="storeProduct in filterStoreProduct ? filteredStoreProducts : displayStoreProducts"
                class="margin-bottom-10"
                :span="sizes[displaySize]"
                :key="storeProduct.guid">
          <el-card class="pointer"
                   :body-style="{ padding: '0px' }"
                   @click.native="addOrderProduct(storeProduct)"
                   shadow="never">
            <img :src="storeProduct.productImageUrl" class="image">
            <el-divider class="full-width margin-0"></el-divider>
            <div class="padding-10-10" :class="textSize[displaySize]">
              <div>{{storeProduct.productCode}}</div>
              <div class="text-bold text-single-line">
                <span>{{storeProduct.productName}}</span>
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
  import hotkeys from "hotkeys-js";
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
    mounted() {
      const vm = this;
      hotkeys('f7', 'posMachine', function (event, handler) {
        vm.$refs.filterStoreProduct.focus();
      });
    },
    data() {
      return {
        isLoading: false,
        filterDebounce: 400,
        filterStoreProduct: "",
        filteredStoreProducts: [],
        textSize: {
          1: 'text-small',
          2: 'text-medium',
          3: 'text-large',
          4: 'text-large',
        },
        displaySize: localStorage.getItem("displayStoreProductSize") ?
          JSON.parse(localStorage.getItem("displayStoreProductSize")) : 2,
        sizes: {
          1: 3,
          2: 4,
          3: 6,
          4: 8,
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

  .image {
    width: 100%;
    display: block;
  }
</style>
