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
  allNotifications: localStorage.getItem("allNotifications") ? JSON.parse(localStorage.getItem("allNotifications")) : [],
  notificationStatus: {
    SEEN: "SEEN",
    UNSEEN: "UNSEEN",
  },
};
const mutations = {
  SET_ALL_NOTIFICATION(state, notifications) {
    state.allNotifications = notifications;
    localStorage.setItem("allNotifications", JSON.stringify(state.allNotifications));
  },
  ADD_NOTIFICATION(state, notification) {
    notification.status = state.notificationStatus.UNSEEN;
    notification.watched = false;
    state.allNotifications = [notification, ...state.allNotifications];
    localStorage.setItem("allNotifications", JSON.stringify(state.allNotifications));
  },
  REMOVE_NOTIFICATION(state, notification) {
    const idx = state.allNotifications.findIndex(item => item.id === notification.id);
    state.allNotifications.splice(idx, 1);
    localStorage.setItem("allNotifications", JSON.stringify(state.allNotifications));
  },
  MARK_ALL_AS_READ(state) {
    state.allNotifications = state.allNotifications.map(item => {
      item.status = "SEEN";
      return item;
    });
    localStorage.setItem("allNotifications", JSON.stringify(state.allNotifications));
  },
  MARK_AS_READ(state, notification) {
    const idx = state.allNotifications.findIndex(item => item.id === notification.id);
    state.allNotifications[idx].status = "SEEN";
    state.allNotifications.splice(idx, 1, state.allNotifications[idx]);
    localStorage.setItem("allNotifications", JSON.stringify(state.allNotifications));
  },
  CLEAR_SEEN_NOTIFICATION(state) {
    state.allNotifications = state.allNotifications.filter(item => item.status !== 'SEEN');
    localStorage.setItem("allNotifications", JSON.stringify(state.allNotifications));
  },
};
const actions = {};

const PosNotificationStore = {
  namespaced: true,
  state,
  mutations,
  actions
};

export default PosNotificationStore;
