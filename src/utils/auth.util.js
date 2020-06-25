import router from "@/router";
import store from "@/store";

const accessToken = "access-token";

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
  /*routeName is the route that we want to redirect to when logged out*/
  store.dispatch("websocket/disconnectWS");
  store.dispatch("user/logout").then(() => {
    localStorage.clear();
    sessionStorage.clear();
    router.push("/login").catch(() => {
    });
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
