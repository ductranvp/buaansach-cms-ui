/* Store module pattern */

import AdminTrackerService from "@/service/admin/admin.tracker.service";

const state = {
  activeUsers: {}
};
const mutations = {
  SET_ACTIVE_USERS: (state, activeUsers) => {
    state.activeUsers = activeUsers;
  },
  ADD_USER_SESSION(state, payload) {
    if (!state.activeUsers[payload.userLogin]) {
      payload.vm.$set(state.activeUsers, payload.userLogin, {});
      payload.vm.$set(state.activeUsers[payload.userLogin], "sessions", []);
    }
    const idx = state.activeUsers[payload.userLogin].sessions.findIndex(item => item.sessionId === payload.sessionId);
    if (idx === -1) state.activeUsers[payload.userLogin].sessions.push(payload);
  },
  REMOVE_USER_SESSION(state, payload) {
    if (state.activeUsers[payload.userLogin]) {
      let userSessions = state.activeUsers[payload.userLogin].sessions;
      const idx = userSessions.findIndex(item => item.sessionId === payload.sessionId);
      userSessions.splice(idx, 1);
    }
  }
};
const actions = {
  async getActiveUsers({commit}) {
    const {data} = await AdminTrackerService.getActiveUsers();
    let activeUsers = {};
    data.forEach(item => {
      activeUsers[item.userLogin] = {};
      activeUsers[item.userLogin].sessions = [];
    });
    data.forEach(item => {
      activeUsers[item.userLogin].sessions.push(item);
    });
    commit("SET_ACTIVE_USERS", activeUsers);
  }
};

const AdminTrackerStore = {
  namespaced: true,
  state,
  mutations,
  actions
};

export default AdminTrackerStore;
