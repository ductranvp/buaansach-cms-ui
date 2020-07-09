/* Store module pattern */
const state = {
  listNotification: localStorage.getItem("cc_notification") ? JSON.parse(localStorage.getItem("cc_notification")) : []
};
const mutations = {
  SET_LIST_NOTIFICATION(state, list) {
    state.listNotification = list;
    localStorage.setItem("cc_notification", JSON.stringify(state.listNotification));
  },
  ADD_NEW_NOTIFICATION(state, notify) {
    state.listNotification.unshift(notify);
    localStorage.setItem("cc_notification", JSON.stringify(state.listNotification));
  },
  CLOSE_NOTIFICATION(state, notify) {
    const idx = state.listNotification.findIndex(item => item.id === notify.id);
    state.listNotification.splice(idx, 1);
    localStorage.setItem("cc_notification", JSON.stringify(state.listNotification));
  },
  MARK_ALL_AS_READ(state) {
    state.listNotification = state.listNotification.map(item => {
      item.status = "SEEN";
      return item;
    });
    localStorage.setItem("cc_notification", JSON.stringify(state.listNotification));
  },
  MARK_AS_READ(state, notify) {
    const idx = state.listNotification.findIndex(item => item.id === notify.id);
    state.listNotification[idx].status = "SEEN";
    state.listNotification.splice(idx, 1, state.listNotification[idx]);
    localStorage.setItem("cc_notification", JSON.stringify(state.listNotification));
  },
  CLEAR_SEEN_NOTIFICATION(state) {
    state.listNotification = state.listNotification.filter(item => item.status !== 'SEEN');
    localStorage.setItem("cc_notification", JSON.stringify(state.listNotification));
  },
};
const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
