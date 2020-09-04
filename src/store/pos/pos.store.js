import PosSeatStore from "@/store/pos/modules/pos.seat.store";
import PosCategoryStore from "@/store/pos/modules/pos.category.store";
import PosAreaStore from "@/store/pos/modules/pos.area.store";
import PosStoreProductStore from "@/store/pos/modules/pos.store-product.store";
import PosOrderStore from "@/store/pos/modules/pos.order.store";
import PosStoreStore from "@/store/pos/modules/pos.store.store";
import PosOrderProductStore from "@/store/pos/modules/pos.order-product.store";
import PosStoreOrderStore from "@/store/pos/modules/notification/pos.store-order.store";
import PosOrderGroupStore from "@/store/pos/modules/pos.order-group.store";
import PosCallWaiterStore from "@/store/pos/modules/notification/pos.call-waiter.store";
import PosStorePayRequest from "@/store/pos/modules/notification/pos.store-pay-request.store";

const state = {
  ready: false,
  ...PosSeatStore.state,
  ...PosAreaStore.state,
  ...PosCategoryStore.state,
  ...PosStoreProductStore.state,
  ...PosOrderStore.state,
  ...PosOrderProductStore.state,
  ...PosStoreStore.state,
  ...PosStoreOrderStore.state,
  ...PosOrderGroupStore.state,
  ...PosCallWaiterStore.state,
  ...PosStorePayRequest.state,
};
const mutations = {
  SET_READY(state, ready) {
    state.ready = ready;
  },
  ...PosSeatStore.mutations,
  ...PosAreaStore.mutations,
  ...PosCategoryStore.mutations,
  ...PosStoreProductStore.mutations,
  ...PosOrderStore.mutations,
  ...PosOrderProductStore.mutations,
  ...PosStoreStore.mutations,
  ...PosStoreOrderStore.mutations,
  ...PosOrderGroupStore.mutations,
  ...PosCallWaiterStore.mutations,
  ...PosStorePayRequest.mutations,
};
const actions = {
  ...PosSeatStore.actions,
  ...PosAreaStore.actions,
  ...PosCategoryStore.actions,
  ...PosStoreProductStore.actions,
  ...PosOrderStore.actions,
  ...PosOrderProductStore.actions,
  ...PosStoreStore.actions,
  ...PosStoreOrderStore.actions,
  ...PosOrderGroupStore.actions,
  ...PosCallWaiterStore.actions,
  ...PosStorePayRequest.actions,
  async initState({state, commit, dispatch}, storeGuid) {
    commit("SET_READY", false);
    const store = dispatch("getCurrentStore", storeGuid);
    const area = dispatch("getAllArea", storeGuid);
    const category = dispatch("getAllCategory", storeGuid);
    await Promise.all([store, area, category]);
    commit("SET_READY", true);
    dispatch("parseData");
  },
  parseData({state, dispatch}) {
    dispatch("changeArea", state.defaultArea.guid);
    dispatch("changeCategory", state.defaultCategory.guid);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
