import AuthUtils from "@/utils/auth.util";
import AccountService from "@/service/account.service";

const state = {
  info: {},
  roles: [],
  langKey: "vi",
  isAuthenticated: false
};

const mutations = {
  SET_INFO: (state, name) => {
    state.name = name;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_LANG_KEY: (state, langKey) => {
    state.langKey = langKey;
  },
  SET_AUTHENTICATED: (state, isAuthenticated) => {
    state.isAuthenticated = isAuthenticated;
  }
};

const actions = {
  // account login (used by dispatched action in login page)
  login({ dispatch }, loginVM) {
    return new Promise((resolve, reject) => {
      /* Get token first */
      AccountService.authenticate(loginVM)
        .then(response => {
          const { data } = response;
          if (!data) reject("Authenticate failed!");
          AuthUtils.setToken(data.accessToken, loginVM.rememberMe);
          /* Then get user info */
          dispatch("getAccount")
            .then(() => {
              resolve(response);
            })
            .catch(error => {
              dispatch("logout");
              reject(error);
            });
        })
        .catch(error => {
          dispatch("logout");
          reject(error);
        });
    });
  },

  // get user info
  getAccount({ commit }) {
    return new Promise((resolve, reject) => {
      AccountService.getInfo()
        .then(response => {
          const { data } = response;
          if (!data) reject("Get account info failed, please login again.");
          commit("SET_INFO", data);
          commit("SET_ROLES", data.authorities);
          commit("SET_LANG_KEY", data.langKey);
          commit("SET_AUTHENTICATED", true);
          /* Resolve when no error */
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit }) {
    commit("SET_INFO", {});
    commit("SET_ROLES", []);
    commit("SET_LANG_KEY", "vi");
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
