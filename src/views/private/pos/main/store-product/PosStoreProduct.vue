<template>
  <el-container class="full-size" direction="vertical" v-loading="isLoading || isRefreshing">
    <el-header class="bg-yellowgreen" height="40px">
      <el-row class="full-size padding-0-10" type="flex" align="middle">
        <el-col :span="21">
          <el-row type="flex" align="middle">
            <el-col :span="10">
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
            <el-col :span="7">
              <div class="padding-left-10">
                <el-tooltip>
                  <div slot="content">Chọn danh mục</div>
                  <el-select size="mini" v-model="selectedCategoryGuid" @change="changeCategory">
                    <el-option label="Tất cả" :value="defaultCategory.guid"></el-option>
                    <el-option v-for="category in allCategories" :key="category.guid" :value="category.guid" :label="category.categoryName"></el-option>
                  </el-select>
                </el-tooltip>
                <!--              <el-dropdown>-->
                <!--                <div class="el-dropdown-link">-->
                <!--                  <span>{{selectedCategory.categoryName}}</span>-->
                <!--                  <i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
                <!--                </div>-->
                <!--                <el-dropdown-menu slot="dropdown">-->
                <!--                  <el-dropdown-item @click.native="changeCategory(defaultCategory.guid)">Tất cả</el-dropdown-item>-->
                <!--                  <el-dropdown-item v-for="category in allCategories" :key="category.guid"-->
                <!--                                    @click.native="changeCategory(category.guid)">-->
                <!--                    <span>{{category.categoryName}}</span>-->
                <!--                  </el-dropdown-item>-->
                <!--                </el-dropdown-menu>-->
                <!--              </el-dropdown>-->
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="3" class="padding-right-10">
          <el-row type="flex" align="middle">
            <el-col>
              <el-slider
                      v-model="itemSize"
                      :step="1"
                      :min="1"
                      :max="2"
                      :format-tooltip="formatTooltip"
                      show-stops>
              </el-slider>
            </el-col>
          </el-row>
        </el-col>
        <div class="text-right">
          <el-button type="success" plain :loading="isRefreshing" size="mini" @click="refreshStoreProduct">
            <span><i class="el-icon-refresh" v-if="!isRefreshing"></i><span>Làm mới</span></span>
          </el-button>
        </div>
      </el-row>
    </el-header>
    <el-main class="show-vertical-scroll full-size padding-left-5 padding-right-5 padding-top-10">
      <el-row :gutter="10" class="full-size margin-0">
        <el-col v-for="storeProduct in filterStoreProduct ? filteredStoreProducts : displayStoreProducts"
                class="margin-bottom-10"
                :span="sizeOptions[itemSize]"
                :key="storeProduct.guid">
          <pos-store-product-item :store-product="storeProduct" :image-size="itemSize"/>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
  import {mapState} from 'vuex';
  import ErrorUtils from '@/utils/error.util';
  import DefaultEntity from '@/utils/default-entity';
  import PosStoreProductItem from '@/views/private/pos/main/store-product/PosStoreProductItem';

  export default {
    name: 'PosStoreProduct',
    components: {PosStoreProductItem},
    computed: {
      ...mapState({
        displayStoreProducts: state => state.posMachine.displayStoreProducts,
        selectedCategory: state => state.posMachine.selectedCategory,
        selectedSeat: state => state.posMachine.selectedSeat,
        currentOrder: state => state.posMachine.currentOrder,
        allCategories: state => state.posMachine.allCategories,
      }),
    },
    data() {
      return {
        isRefreshing: false,
        isLoading: false,
        filterDebounce: 300,
        filterStoreProduct: '',
        filteredStoreProducts: [],
        itemSize: 1,
        sizeOptions: {
          1: 4,
          2: 6,
        },
        defaultCategory: DefaultEntity.category,
        selectedCategoryGuid: DefaultEntity.category.guid,
      };
    },
    watch: {
      selectedCategory: function() {
        this.filterStoreProduct = '';
      },
    },
    methods: {
      formatTooltip(value) {
        return 'Cỡ hiển thị: ' + value;
      },
      changeCategory(categoryGuid) {
        this.$store.dispatch('posMachine/changeCategory', categoryGuid);
      },
      async refreshStoreProduct() {
        const vm = this;
        try {
          vm.isRefreshing = true;
          await vm.$store.dispatch('posMachine/getAllCategory', vm.$route.params.storeGuid);
          await vm.$store.dispatch('posMachine/changeCategory', vm.selectedCategory.guid);
          setTimeout(function() {
            vm.isRefreshing = false;
          }, 300);
        } catch (error) {
          ErrorUtils.showActionErrorMessage(error);
        }
      },
      queryStoreProduct(keyword, cb) {
        keyword = keyword.trim();
        this.filteredStoreProducts = this.displayStoreProducts.filter(
          storeProduct => storeProduct.productCode.toLowerCase().search(keyword) !== -1 ||
            storeProduct.productName.toLowerCase().search(keyword) !== -1);
        this.isLoading = false;
        cb([]);
      },
    },
  };
</script>

<style scoped>
  .el-dropdown-link {
    cursor: pointer;
    color: white;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
