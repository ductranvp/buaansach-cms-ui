/* Store module pattern */

const state = {
  adminCurrentStore: {}
};
const mutations = {
  SET_CURRENT_STORE: (state, adminCurrentStore) => {
    state.adminCurrentStore = adminCurrentStore;
  }

};
const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
