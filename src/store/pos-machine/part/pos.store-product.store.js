/* Store module pattern */
import Constants from "@/utils/constants";

const state = {
  allStoreProducts: [],
  displayStoreProducts: [],
};
const mutations = {
  SET_ALL_STORE_PRODUCT(state, allStoreProducts) {
    state.allStoreProducts = allStoreProducts;
  },
  SET_DISPLAY_STORE_PRODUCT(state, displayStoreProducts) {
    state.displayStoreProducts = displayStoreProducts;
  },
};
const actions = {
  changeDisplayStoreProduct({state, commit}, categoryGuid) {
    let displayStoreProducts;
    if (categoryGuid === Constants.DEFAULT_CATEGORY_GUID) displayStoreProducts = state.allStoreProducts;
    else {
      const cat = state.allCategories.find(category => category.guid === categoryGuid);
      displayStoreProducts = cat.listStoreProduct;
    }
    commit("SET_DISPLAY_STORE_PRODUCT", displayStoreProducts);
  },
};

const PosStoreProductStore = {
  state,
  mutations,
  actions
};
export default PosStoreProductStore;
