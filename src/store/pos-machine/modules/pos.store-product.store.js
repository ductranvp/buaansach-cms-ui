/* Store module pattern */
import Constants from "@/utils/constants";

const state = {
  allStoreProducts: [],
  displayStoreProducts: [],
};
const mutations = {
  SET_STORE_PRODUCT(state, allStoreProducts) {
    state.allStoreProducts = allStoreProducts;
  },

  SET_DISPLAY_STORE_PRODUCT(state, displayStoreProducts) {
    state.displayStoreProducts = displayStoreProducts;
  },
};
const actions = {
  changeDisplayStoreProduct({state, commit}, categoryGuid) {
    let displayStoreProducts;
    if (categoryGuid === Constants.DEFAULT_CATEGORY) displayStoreProducts = state.allStoreProducts;
    else displayStoreProducts = state.allStoreProducts.filter(product => product.categoryGuid === categoryGuid);
    commit("SET_CURRENT_CATEGORY", categoryGuid);
    commit("SET_DISPLAY_STORE_PRODUCT", displayStoreProducts);
  },
};

const PosStoreProductStore = {
  state,
  mutations,
  actions
};
export default PosStoreProductStore;
