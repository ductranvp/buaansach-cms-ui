/* Store module pattern */
const state = {
  listNotification: []
};
const mutations = {
  SET_LIST_NOTIFICATION(state, list) {
    state.listNotification = list;
  },
  ADD_NEW_NOTIFICATION(state, notify) {
    state.listNotification.unshift(notify);
  },
  CLOSE_NOTIFICATION(state, notify) {
    const idx = state.listNotification.findIndex(item => item.customerPhone === notify.customerPhone);
    state.listNotification.splice(idx, 1);
  },
  MARK_ALL_AS_READ(state) {
    state.listNotification = state.listNotification.map(item => {
      item.status = "SEEN";
      return item;
    });
  },
  MARK_AS_READ(state, notify) {
    const idx = state.listNotification.findIndex(item => item.customerPhone === notify.customerPhone);
    state.listNotification[idx].status = "SEEN";
    state.listNotification.splice(idx, 1, state.listNotification[idx]);
  },
  CLEAR_SEEN_NOTIFICATION(state) {
    state.listNotification = state.listNotification.filter(item => item.status !== 'SEEN');
  },
};
const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
