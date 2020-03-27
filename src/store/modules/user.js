import AuthUtils from "@/utils/auth.util";
import AccountService from "@/service/account.service";
import i18n from "@/i18n";

const state = {
  info: {},
  roles: [],
  isAuthenticated: false
};

const mutations = {
  SET_INFO: (state, info) => {
    state.info = info;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
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
            .then(anotherResponse => {
              /* response of getAccount action */
              const { langKey } = anotherResponse;
              // When user login success => set app language to user language
              i18n.changeLanguage(langKey);
              resolve(anotherResponse);
            })
            .catch(anotherError => {
              dispatch("logout");
              /* error of getAccount action */
              reject(anotherError);
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
          const { authorities } = data;
          commit("SET_INFO", data);
          commit("SET_ROLES", authorities);
          commit("SET_AUTHENTICATED", true);
          /* Resolve when no error */
          resolve(data);
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
