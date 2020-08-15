/* Store module pattern */

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
  SET_CALL_WAITER_NOTIFICATION(state, notifications) {
    state.callWaiterNotifications = notifications;
  },
  ADD_CALL_WAITER_NOTIFICATION(state, notification) {
    state.callWaiterNotifications.push(notification);
  },
  SEEN_CALL_WAITER_NOTIFICATION(state, notification){
    let idx = state.callWaiterNotifications.findIndex(item => item.id === notification.id);
    state.callWaiterNotifications[idx].status = "SEEN";
    state.callWaiterNotifications.splice(idx, 1, state.callWaiterNotifications[idx]);
  },
  REMOVE_CALL_WAITER_NOTIFICATION(state, notification) {
    let idx = state.callWaiterNotifications.findIndex(item => item.id === notification.id);
    state.callWaiterNotifications.splice(idx, 1);
  },
  CLEAR_SEEN_CALL_WAITER_NOTIFICATION(state){
    state.callWaiterNotifications = state.callWaiterNotifications.filter(item => item.status !== "SEEN");
  },
  CLEAR_ALL_CALL_WAITER_NOTIFICATION(state){
    state.callWaiterNotifications = [];
  }
};
const actions = {

};

const PosCallWaiterStore = {
  namespaced: true,
  state,
  mutations,
  actions
};

export default PosCallWaiterStore;
