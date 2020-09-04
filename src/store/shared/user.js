import AuthUtils from "@/utils/auth.util";
import UserService from "@/service/shared/user.service";
import i18n from "@/i18n";
import NotificationUtils from "@/utils/notification.util";

const state = {
  info: {},
  authorities: [],
  isAuthenticated: false
};

const mutations = {
  SET_INFO: (state, info) => {
    state.info = info;
  },
  SET_AUTHORITIES: (state, authorities) => {
    state.authorities = authorities;
  },
  SET_AUTHENTICATED: (state, isAuthenticated) => {
    state.isAuthenticated = isAuthenticated;
  }
};

const actions = {
  // account login (used by dispatched action in login page)
  async login({state, dispatch}, loginVM) {
    try {
      const {data} = await UserService.authenticate(loginVM);
      AuthUtils.setToken(data.accessToken, loginVM.rememberMe);
      await dispatch("getAccount");
      i18n.changeLanguage(state.info.langKey);
    } catch (error) {
      dispatch("logout");
    }
  },

  // get user info
  async getAccount({commit}) {
    try {
      const {data} = await UserService.getUserInfo();
      const {authorities} = data;
      commit("SET_INFO", data);
      commit("SET_AUTHORITIES", authorities);
      commit("SET_AUTHENTICATED", true);
    } catch (error) {
      NotificationUtils.error("Lấy thông tin người dùng thất bại");
    }
  },

  // user logout
  logout({commit}) {
    commit("SET_INFO", {});
    commit("SET_AUTHORITIES", []);
    commit("SET_AUTHENTICATED", false);
    AuthUtils.removeToken();
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
