/* Store module pattern */
const notificationEntity = {
  id: null,
  title: null,
  content: null,
  time: null,
  status: "UNSEEN",
  watched: false
};
const state = {
  allNotifications: [],
  notificationStatus: {
    SEEN: "SEEN",
    UNSEEN: "UNSEEN",
  },
};
const mutations = {
  SET_ALL_NOTIFICATION(state, notifications) {
    state.allNotifications = notifications;
  },
  ADD_NOTIFICATION(state, notification) {
    notification.status = state.notificationStatus.UNSEEN;
    notification.watched = false;
    state.allNotifications = [notification, ...state.allNotifications];
  },
  REMOVE_NOTIFICATION(state, notificationId) {
    const idx = state.allNotifications.findIndex(noti => noti.id === notificationId);
    state.allNotifications.splice(idx, 1);
  },
  CHANGE_NOTIFICATION_STATUS(state, {notificationId, status}) {

  },
  WATCH_NOTIFICATION(state) {
    state.allNotifications.forEach(noti => noti.watched = true);
  }
};
const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
