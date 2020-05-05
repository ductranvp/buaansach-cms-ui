/* Store module pattern */
const state = {
  currentStore: {}
};
const mutations = {
  SET_CURRENT_STORE(state, store) {
    state.currentStore = store;
  },
  CHANGE_STORE_STATUS(state, status){
    state.currentStore.storeStatus = status;
  }
};
const actions = {};

const PosStoreStore = {
  namespaced: true,
  state,
  mutations,
  actions
};
export default PosStoreStore;
