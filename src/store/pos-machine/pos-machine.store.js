import PosSeatStore from "@/store/pos-machine/part/pos.seat.store";
import PosCategoryStore from "@/store/pos-machine/part/pos.category.store";
import PosAreaStore from "@/store/pos-machine/part/pos.area.store";
import PosStoreProductStore from "@/store/pos-machine/part/pos.store-product.store";
import PosOrderStore from "@/store/pos-machine/part/pos.order.store";
import PosStoreStore from "@/store/pos-machine/part/pos.store.store";
import PosOrderProductStore from "@/store/pos-machine/part/pos.order-product.store";
import PosNotificationStore from "@/store/pos-machine/part/pos.notification.store";

const state = {
  ready: false,
  ...PosSeatStore.state,
  ...PosAreaStore.state,
  ...PosCategoryStore.state,
  ...PosStoreProductStore.state,
  ...PosOrderStore.state,
  ...PosOrderProductStore.state,
  ...PosStoreStore.state,
  ...PosNotificationStore.state,
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
  ...PosNotificationStore.mutations,
};
const actions = {
  ...PosSeatStore.actions,
  ...PosAreaStore.actions,
  ...PosCategoryStore.actions,
  ...PosStoreProductStore.actions,
  ...PosOrderStore.actions,
  ...PosOrderProductStore.actions,
  ...PosStoreStore.actions,
  ...PosNotificationStore.actions,
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
