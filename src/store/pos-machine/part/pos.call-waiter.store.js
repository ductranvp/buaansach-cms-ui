/* Store module pattern */

const state = {
  callWaiters: [],
};

// let callWaiter = {
//   id: null,
//   title: null,
//   createdDate: null,
//   status: "UNSEEN"
// };

const mutations = {
  SET_CALL_WAITER(state, notifications) {
    state.callWaiters = notifications;
  },
  ADD_CALL_WAITER(state, notification) {
    state.callWaiters.push(notification);
  },
  SEEN_CALL_WAITER(state, notification){
    let idx = state.callWaiters.findIndex(item => item.id === notification.id);
    state.callWaiters[idx].status = "SEEN";
    state.callWaiters.splice(idx, 1, state.callWaiters[idx]);
  },
  REMOVE_CALL_WAITER(state, notification) {
    let idx = state.callWaiters.findIndex(item => item.id === notification.id);
    state.callWaiters.splice(idx, 1);
  },
  CLEAR_SEEN_CALL_WAITER(state){
    state.callWaiters = state.callWaiters.filter(item => item.status !== "SEEN");
  },
  CLEAR_ALL_CALL_WAITER(state){
    state.callWaiters = [];
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
