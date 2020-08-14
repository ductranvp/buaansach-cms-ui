/* Store module pattern */
import PosStoreService from "@/service/pos/pos.store.service";

const state = {
  currentStoreGuid: null,
  currentStore: {}
};
const mutations = {
  SET_CURRENT_STORE(state, store) {
    state.currentStore = store;
  },
  SET_CURRENT_STORE_GUID(state, currentStoreGuid) {
    state.currentStoreGuid = currentStoreGuid;
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
