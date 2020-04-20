/* Store module pattern */
import Constants from "@/utils/constants";

const state = {
  allStoreProducts: [],
  selectedStoreProducts: [],
};
const mutations = {
  SET_STORE_PRODUCT(state, allStoreProducts) {
    state.allStoreProducts = allStoreProducts;
  },

  SET_SELECTED_STORE_PRODUCT(state, selectedStoreProducts) {
    state.selectedStoreProducts = selectedStoreProducts;
  },
};
const actions = {

  changeSelectedStoreProduct({state, commit}, categoryGuid) {
    let displayStoreProducts;
    if (categoryGuid === Constants.DEFAULT_CATEGORY) displayStoreProducts = state.allStoreProducts;
    else displayStoreProducts = state.allStoreProducts.filter(product => product.categoryGuid === categoryGuid);
    commit("SET_CURRENT_CATEGORY", categoryGuid);
    commit("SET_SELECTED_STORE_PRODUCT", displayStoreProducts);
  },
};

const PosStoreProductStore = {
  state,
  mutations,
  actions
};
export default PosStoreProductStore;
