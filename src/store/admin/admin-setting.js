/* Store module pattern */
const state = {
  adminSidebarCollapse: localStorage.getItem('adminSidebarCollapse') ?
    JSON.parse(localStorage.getItem('adminSidebarCollapse')) : true
};
const mutations = {
  TOGGLE_ADMIN_SIDEBAR(state) {
    state.adminSidebarCollapse = !state.adminSidebarCollapse;
    localStorage.setItem("adminSidebarCollapse", state.adminSidebarCollapse);
  }
};
const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
