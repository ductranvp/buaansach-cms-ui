/* Store module pattern */
import PosCategoryService from "@/service/pos/pos.category.service";

const defaultCategoryEntity = {
  guid: "all",
  categoryName: "Tất cả",
  listStoreProduct: [],
};

const state = {
  allCategories: [],
  defaultCategory: defaultCategoryEntity,
  selectedCategory: defaultCategoryEntity,
};
const mutations = {
  SET_ALL_CATEGORY(state, allCategories) {
    state.allCategories = allCategories;
  },
  CHANGE_CATEGORY(state, categoryGuid) {
    if (categoryGuid === state.defaultCategory.guid) {
      state.selectedCategory = state.defaultCategory;
    } else {
      state.selectedCategory = state.allCategories.find(category => category.guid === categoryGuid);
    }
  }
};
const actions = {
  async getAllCategory({commit}, storeGuid) {
    const categoryData = await PosCategoryService.getListPosCategoryDTO(storeGuid);
    commit("SET_ALL_CATEGORY", categoryData.data);
    /* parse all store product */
    let allStoreProducts = [];
    let storeProductMap = new Map();
    categoryData.data.forEach(category => {
      category.listStoreProduct.forEach(storeProduct => {
        storeProductMap.set(storeProduct.productGuid, storeProduct);
      });
    });
    for (let key of storeProductMap.keys()) {
      allStoreProducts.push(storeProductMap.get(key));
    }
    allStoreProducts.sort(function (a, b) {
      if (a.productPosition > b.productPosition) return 1;
      if (a.productPosition < b.productPosition) return -1;
      return 0;
    });
    commit("SET_ALL_STORE_PRODUCT", allStoreProducts);
  },
  changeCategory({dispatch, commit}, categoryGuid) {
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
