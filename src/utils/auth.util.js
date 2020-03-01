import router from "@/router";

const accessToken = "access-token";
import store from "@/store";

function getToken() {
  return (
    localStorage.getItem(accessToken) || sessionStorage.getItem(accessToken)
  );
}

function setToken(token, rememberMe) {
  if (rememberMe) {
    localStorage.setItem(accessToken, token);
  } else {
    sessionStorage.setItem(accessToken, token);
  }
}

function removeToken() {
  sessionStorage.removeItem(accessToken);
  localStorage.removeItem(accessToken);
}

function hasAnyAuthority(authorities) {
  for (let i = 0; i < authorities.length; i++) {
    if (store.getters.roles.includes(authorities[i])) {
      return true;
    }
  }
  return false;
}

function logout() {
  store.dispatch("user/logout").then(() => {
    router.push("/").catch(() => {});
  });
}

const AuthUtils = {
  getToken: getToken,
  setToken: setToken,
  removeToken: removeToken,
  hasAnyAuthority: hasAnyAuthority,
  logout: logout
};

export default AuthUtils;
