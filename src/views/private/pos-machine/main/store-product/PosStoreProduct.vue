<template>
  <el-container class="full-size" direction="vertical">
    <el-header class="padding-0-10 bg-yellowgreen" height="42px">
      <el-row :gutter="10" class="full-size" type="flex" align="middle">
        <el-col :span="8">
          <el-autocomplete
            ref="filterStoreProduct"
            class="full-width"
            size="small"
            v-model="filterStoreProduct"
            :fetch-suggestions="queryStoreProduct"
            placeholder="Nhập mã hoặc tên sản phẩm (F4)"
            :debounce="filterDebounce"
            :trigger-on-focus="false">
          </el-autocomplete>
        </el-col>
        <el-col :span="10" class="text-center">
          <span class="text-bold">{{selectedCategory.categoryName}}</span>
        </el-col>
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
        <el-col v-for="storeProduct in filterStoreProduct ? filteredStoreProducts : selectedStoreProducts"
                class="margin-bottom-10"
                :span="sizes[displaySize]"
                :key="storeProduct.guid">
          <el-card :body-style="{ padding: '0px' }" shadow="never">
            <img :src="storeProduct.productImageUrl" class="image">
            <el-divider class="full-width margin-10-0"></el-divider>
            <div class="text-center  padding-bottom-10">
              <div>{{storeProduct.productName}}</div>
              <div>{{storeProduct.productNormalPrice | price}}</div>
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

  export default {
    name: "PosStoreProduct",
    computed: {
      ...mapState({
        selectedStoreProducts: state => state.posMachine.selectedStoreProducts,
        selectedCategory: state => state.posMachine.selectedCategory
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
        displaySize: localStorage.getItem("displayStoreProductSize") ?
          JSON.parse(localStorage.getItem("displayStoreProductSize")) : 3,
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
      changeDisplayStoreProductSize(value) {
        localStorage.setItem("displayStoreProductSize", value);
      },
      queryStoreProduct(keyword, cb) {
        keyword = keyword.trim();
        this.filteredStoreProducts = this.selectedStoreProducts
          .filter(storeProduct => storeProduct.productCode.toLowerCase().search(keyword) !== -1 || storeProduct.productName.toLowerCase().search(keyword) !== -1);
        this.isLoading = false;
        cb([]);
      }
    }
  };
</script>

<style scoped>
  .image {
    width: 100%;
    display: block;
  }
</style>
