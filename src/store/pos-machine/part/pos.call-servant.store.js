/* Store module pattern */

const state = {
  callServantNotifications: [],
};

// let callServant = {
//   id: null,
//   title: null,
//   createdDate: null,
//   status: "UNSEEN"
// };

const mutations = {
  SET_CALL_SERVANT_NOTIFICATIONS(state, notifications) {
    state.callServantNotifications = notifications;
  },
  ADD_CALL_SERVANT_NOTIFICATION(state, notification) {
    state.callServantNotifications.push(notification);
  },
  SEEN_CALL_SERVANT_NOTIFICATION(state, notification){
    let idx = state.callServantNotifications.findIndex(item => item.id === notification.id);
    state.callServantNotifications[idx].status = "SEEN";
    state.callServantNotifications.splice(idx, 1, state.callServantNotifications[idx]);
  },
  REMOVE_CALL_SERVANT_NOTIFICATION(state, notification) {
    let idx = state.callServantNotifications.findIndex(item => item.id === notification.id);
    state.callServantNotifications.splice(idx, 1);
  },
  CLEAR_SEEN_CALL_SERVANT_NOTIFICATION(state){
    state.callServantNotifications = state.callServantNotifications.filter(item => item.status !== "SEEN");
  },
  CLEAR_ALL_CALL_SERVANT_NOTIFICATION(state){
    state.callServantNotifications = [];
  }
};
const actions = {

};

const PosCallServantNotificationStore = {
  namespaced: true,
  state,
  mutations,
  actions
};

export default PosCallServantNotificationStore;
