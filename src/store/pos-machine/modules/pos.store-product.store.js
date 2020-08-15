/* Store module pattern */
import Constants from "@/utils/constants";
import PosStoreProductService from "@/service/pos/pos.store-product.service";

const storeProductStatus = {
  AVAILABLE: "AVAILABLE",
  UNAVAILABLE: "UNAVAILABLE",
  STOP_TRADING: "STOP_TRADING"
};

const state = {
  allStoreProducts: [],
  displayStoreProducts: [],
  storeProductStatus: storeProductStatus
};
const mutations = {
  SET_ALL_STORE_PRODUCT(state, allStoreProducts) {
    state.allStoreProducts = allStoreProducts;
  },
  SET_DISPLAY_STORE_PRODUCT(state, displayStoreProducts) {
    state.displayStoreProducts = displayStoreProducts;
  },
  SET_STORE_PRODUCT_STATUS(state, {storeProductGuid, storeProductStatus}) {
    const idx = state.displayStoreProducts.findIndex(item => item.guid === storeProductGuid);
    state.displayStoreProducts[idx].storeProductStatus = storeProductStatus;
    state.displayStoreProducts.splice(idx, 1, state.displayStoreProducts[idx]);
  }
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
  async changeStoreProductStatus({state, commit}, {storeProductGuid, storeProductStatus}) {
    const payload = {
      storeGuid: state.currentStore.guid,
      storeProductGuid: storeProductGuid,
      storeProductStatus: storeProductStatus
    };
    await PosStoreProductService.changeStoreProductStatus(payload);
    commit("SET_STORE_PRODUCT_STATUS", {storeProductGuid: storeProductGuid, storeProductStatus: storeProductStatus});
  }
};

const PosStoreProductStore = {
  state,
  mutations,
  actions
};
export default PosStoreProductStore;
