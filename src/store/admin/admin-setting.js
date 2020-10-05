/* Store module pattern */
import StorageKey from '@/utils/storage-key';

const state = {
  adminSidebarCollapse: localStorage.getItem(StorageKey.localStorageKeys.ADMIN_SIDEBAR_COLLAPSE) ?
    JSON.parse(localStorage.getItem(StorageKey.localStorageKeys.ADMIN_SIDEBAR_COLLAPSE)) : false
};
const mutations = {
  TOGGLE_ADMIN_SIDEBAR(state) {
    state.adminSidebarCollapse = !state.adminSidebarCollapse;
    localStorage.setItem(StorageKey.localStorageKeys.ADMIN_SIDEBAR_COLLAPSE, state.adminSidebarCollapse);
  }
};
const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
