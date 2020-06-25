/* Store module pattern */
const notificationEntity = {
  id: null,
  title: null,
  content: null,
  time: null,
  status: "UNSEEN",
  watched: false,
  seatData: null
};
const state = {
  storeNotifications: [],
  notificationStatus: {
    SEEN: "SEEN",
    UNSEEN: "UNSEEN",
  },
};
const mutations = {
  SET_STORE_NOTIFICATIONS(state, notifications) {
    state.storeNotifications = notifications;
  },
  CLEAR_STORE_NOTIFICATIONS(state) {
    state.storeNotifications = [];
    localStorage.removeItem(state.currentStoreGuid);
  },
  ADD_NOTIFICATION(state, notification) {
    notification.status = state.notificationStatus.UNSEEN;
    notification.watched = false;
    state.storeNotifications = [notification, ...state.storeNotifications];
    localStorage.setItem(state.currentStoreGuid, JSON.stringify(state.storeNotifications));
  },
  REMOVE_NOTIFICATION(state, notification) {
    const idx = state.storeNotifications.findIndex(item => item.id === notification.id);
    state.storeNotifications.splice(idx, 1);
    localStorage.setItem(state.currentStoreGuid, JSON.stringify(state.storeNotifications));
  },
  MARK_ALL_AS_READ(state) {
    state.storeNotifications = state.storeNotifications.map(item => {
      item.status = "SEEN";
      return item;
    });
    localStorage.setItem(state.currentStoreGuid, JSON.stringify(state.storeNotifications));
  },
  MARK_AS_READ(state, notification) {
    const idx = state.storeNotifications.findIndex(item => item.id === notification.id);
    state.storeNotifications[idx].status = "SEEN";
    state.storeNotifications.splice(idx, 1, state.storeNotifications[idx]);
    localStorage.setItem(state.currentStoreGuid, JSON.stringify(state.storeNotifications));
  },
  CLEAR_SEEN_NOTIFICATION(state) {
    state.storeNotifications = state.storeNotifications.filter(item => item.status !== 'SEEN');
    localStorage.setItem(state.currentStoreGuid, JSON.stringify(state.storeNotifications));
  },
};
const actions = {
  getStoreNotification({state, commit}, storeGuid){
    let storeNotifications = localStorage.getItem(storeGuid) ? JSON.parse(localStorage.getItem(storeGuid)) : [];
    commit("SET_STORE_NOTIFICATIONS", storeNotifications);
  }
};

const PosNotificationStore = {
  namespaced: true,
  state,
  mutations,
  actions
};

export default PosNotificationStore;
