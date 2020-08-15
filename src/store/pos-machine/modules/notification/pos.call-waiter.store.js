/* Store module pattern */
const callWaiterSuffix = "_call_waiter";
const state = {
  callWaiterNotifications: [],
};

// let callWaiter = {
//   id: null,
//   title: null,
//   createdDate: null,
//   status: "UNSEEN"
// };

const mutations = {
  SET_CALL_WAITER_NOTIFICATIONS(state, notifications) {
    state.callWaiterNotifications = notifications;
    localStorage.setItem(state.currentStoreGuid + callWaiterSuffix, JSON.stringify(state.callWaiterNotifications));
  },
  ADD_CALL_WAITER_NOTIFICATION(state, notification) {
    state.callWaiterNotifications.push(notification);
    localStorage.setItem(state.currentStoreGuid + callWaiterSuffix, JSON.stringify(state.callWaiterNotifications));
  },
  SEEN_CALL_WAITER_NOTIFICATION(state, notification){
    let idx = state.callWaiterNotifications.findIndex(item => item.id === notification.id);
    state.callWaiterNotifications[idx].status = "SEEN";
    state.callWaiterNotifications.splice(idx, 1, state.callWaiterNotifications[idx]);
    localStorage.setItem(state.currentStoreGuid + callWaiterSuffix, JSON.stringify(state.callWaiterNotifications));
  },
  REMOVE_CALL_WAITER_NOTIFICATION(state, notification) {
    let idx = state.callWaiterNotifications.findIndex(item => item.id === notification.id);
    state.callWaiterNotifications.splice(idx, 1);
    localStorage.setItem(state.currentStoreGuid + callWaiterSuffix, JSON.stringify(state.callWaiterNotifications));
  },
  CLEAR_SEEN_CALL_WAITER_NOTIFICATION(state){
    state.callWaiterNotifications = state.callWaiterNotifications.filter(item => item.status !== "SEEN");
    localStorage.setItem(state.currentStoreGuid + callWaiterSuffix, JSON.stringify(state.callWaiterNotifications));
  },
  CLEAR_ALL_CALL_WAITER_NOTIFICATION(state){
    state.callWaiterNotifications = [];
    localStorage.removeItem(state.currentStoreGuid + callWaiterSuffix);
  }
};
const actions = {
  getStoreCallWaiter({state, commit}, storeGuid){
    let callWaiters = localStorage.getItem(storeGuid  + callWaiterSuffix) ? JSON.parse(localStorage.getItem(storeGuid  + callWaiterSuffix)) : [];
    commit("SET_CALL_WAITER_NOTIFICATIONS", callWaiters);
  }
};

const PosCallWaiterStore = {
  namespaced: true,
  state,
  mutations,
  actions
};

export default PosCallWaiterStore;
