/* Store module pattern */

import AdminTrackerStore from "@/store/admin/admin-tracker.store";

const state = {
  adminCurrentStore: {},
  ...AdminTrackerStore.state,
};
const mutations = {
  SET_ADMIN_CURRENT_STORE: (state, adminCurrentStore) => {
    state.adminCurrentStore = adminCurrentStore;
  },
  ...AdminTrackerStore.mutations,

};
const actions = {
  ...AdminTrackerStore.actions,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
