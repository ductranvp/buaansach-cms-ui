import AuthUtils from '@/utils/auth.util';
import UserService from '@/service/shared/user.service';
import i18n from '@/i18n';
import AppUtils from '@/utils/app.util';

const state = {
  userInfo: {},
  authorities: [],
  isAuthenticated: false,
};

const mutations = {
  SET_USER_INFO: (state, info) => {
    state.userInfo = info;
  },
  SET_AUTHORITIES: (state, authorities) => {
    state.authorities = authorities;
  },
  SET_AUTHENTICATED: (state, isAuthenticated) => {
    state.isAuthenticated = isAuthenticated;
  },
};

const actions = {
  // account login (used by dispatched action in login page)
  async login({state, dispatch}, loginVM) {
    const payload = AppUtils.deepCopy(loginVM);
    const rememberMe = payload.rememberMe;
    payload.rememberMe = false;
    const {data} = await UserService.authenticate(payload);
    AuthUtils.setToken(data.accessToken, rememberMe);
    await dispatch('getAccount');
    i18n.changeLanguage(state.userInfo.langKey);
  },

  // get user info
  async getAccount({commit}) {
    const {data} = await UserService.getUserInfo();
    const {authorities} = data;
    commit("SET_USER_INFO", data || {});
    commit('SET_AUTHORITIES', authorities || []);
    commit('SET_AUTHENTICATED', true);
  },

  // user logout
  logout({commit}) {
    commit('SET_USER_INFO', {});
    commit('SET_AUTHORITIES', []);
    commit('SET_AUTHENTICATED', false);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
