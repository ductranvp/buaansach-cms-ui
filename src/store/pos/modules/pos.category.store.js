/* Store module pattern */
import PosCategoryService from "@/service/pos/pos.category.service";
import DefaultEntity from "@/utils/default-entity";

const state = {
  allCategories: [],
  selectedCategory: DefaultEntity.category,
};
const mutations = {
  SET_ALL_CATEGORY(state, allCategories) {
    state.allCategories = allCategories;
  },
  CHANGE_CATEGORY(state, categoryGuid) {
    if (categoryGuid === DefaultEntity.category.guid) {
      state.selectedCategory = DefaultEntity.category;
    } else {
      state.selectedCategory = state.allCategories.find(category => category.guid === categoryGuid);
    }
  }
};
const actions = {
  async getAllCategory({commit}, storeGuid) {
    const {data: categoryData} = await PosCategoryService.getListPosCategoryDTO(storeGuid);
    commit("SET_ALL_CATEGORY", categoryData);
    /* parse all store product */
    let allStoreProducts = [];
    let storeProducts = {};
    categoryData.forEach(category => {
      category.listStoreProduct.forEach(storeProduct => {
        storeProducts[storeProduct.productGuid] = storeProduct;
      });
    });
    Object.keys(storeProducts).forEach(key => {
      allStoreProducts.push(storeProducts[key]);
    });
    allStoreProducts.sort(function (a, b) {
      if (a.productPosition > b.productPosition) return 1;
      if (a.productPosition < b.productPosition) return -1;
      return 0;
    });
    commit("SET_ALL_STORE_PRODUCT", allStoreProducts);
  },
  changeCategory({dispatch, commit}, categoryGuid) {
    categoryGuid = categoryGuid || DefaultEntity.category.guid;
    commit("CHANGE_CATEGORY", categoryGuid);
    dispatch("changeDisplayStoreProduct", categoryGuid);
  }
};

const PosCategoryStore = {
  state,
  mutations,
  actions
};
export default PosCategoryStore;
