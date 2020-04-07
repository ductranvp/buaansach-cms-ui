/* Store module pattern */

const state = {
  currentStore: {}
};
const mutations = {
  SET_CURRENT_STORE: (state, currentStore) => {
    console.log("Commit SET_CURRENT_STORE");
    state.currentStore = currentStore;
  }

};
const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
