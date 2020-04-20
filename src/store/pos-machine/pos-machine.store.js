import PosSeatService from "@/service/pos/pos.seat.service";
import NotificationUtils from "@/utils/notification.util";
import PosStoreProductService from "@/service/pos/pos.store-product.service";
import PosCategoryService from "@/service/pos/pos.category.service";
import PosAreaService from "@/service/pos/pos.area.service";

import PosSeatStore from "@/store/pos-machine/modules/pos.seat.store";
import PosCategoryStore from "@/store/pos-machine/modules/pos.category.store";
import PosAreaStore from "@/store/pos-machine/modules/pos.area.store";
import PosStoreProductStore from "@/store/pos-machine/modules/pos.store-product.store";

const state = {
  ready: false,
  ...PosSeatStore.state,
  ...PosAreaStore.state,
  ...PosCategoryStore.state,
  ...PosStoreProductStore.state,
};
const mutations = {
  SET_READY(state, ready) {
    state.ready = ready;
  },
  ...PosSeatStore.mutations,
  ...PosAreaStore.mutations,
  ...PosCategoryStore.mutations,
  ...PosStoreProductStore.mutations,
};
const actions = {
  ...PosSeatStore.actions,
  ...PosAreaStore.actions,
  ...PosCategoryStore.actions,
  ...PosStoreProductStore.actions,
  async initState({state, commit, dispatch}, storeGuid) {
    try {
      commit("SET_READY", false);

      const seatData = await PosSeatService.getListSeatByStoreGuid(storeGuid);
      commit("SET_SEAT", seatData.data);

      const areaData = await PosAreaService.getListAreaWithoutSeatByStoreGuid(storeGuid);
      commit("SET_AREA", areaData.data);

      const categoryData = await PosCategoryService.getListPosCategoryDTO();
      commit("SET_CATEGORY", categoryData.data);

      const storeProductData = await PosStoreProductService.getListProductByStoreGuid(storeGuid);
      commit("SET_STORE_PRODUCT", storeProductData.data);

      commit("SET_READY", true);
      dispatch("parseData");
    } catch (error) {
      NotificationUtils.error(error.message || error.data.message);
    }
  },
  parseData({state, dispatch}) {
    dispatch("changeSelectedSeat", state.currentAreaGuid);
    dispatch("changeSelectedStoreProduct", state.currentCategoryGuid);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
