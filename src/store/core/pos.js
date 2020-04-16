/* Store module pattern */
const state = {
  currentStore: localStorage.getItem('posStore') ?
    JSON.parse(localStorage.getItem('posStore')) : {}
};
const mutations = {
  SET_CURRENT_STORE(state, store) {
    state.currentStore = store;
    localStorage.setItem("posStore", JSON.stringify(store));
  }
};
const actions = {
  getStore(storeGui){

  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
