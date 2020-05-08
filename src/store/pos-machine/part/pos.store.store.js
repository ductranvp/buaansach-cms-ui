/* Store module pattern */
import PosStoreService from "@/service/pos/pos.store.service";

const state = {
  currentStore: {}
};
const mutations = {
  SET_CURRENT_STORE(state, store) {
    state.currentStore = store;
  },
  CHANGE_STORE_STATUS(state, status) {
    state.currentStore.storeStatus = status;
  }
};
const actions = {
  async getCurrentStore({commit}, storeGuid) {
    const storeData = await PosStoreService.getStore(storeGuid);
    commit("SET_CURRENT_STORE", storeData.data);
  }
};

const PosStoreStore = {
  namespaced: true,
  state,
  mutations,
  actions
};
export default PosStoreStore;
