import router from '@/router';
import store from '@/store';
import StorageKey from '@/utils/storage-key';

const accessToken = StorageKey.common.ACCESS_TOKEN;

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
    if (store.getters.authorities.includes(authorities[i])) {
      return true;
    }
  }
  return false;
}

async function logout(noRedirect) {
  /*routeName is the route that we want to redirect to when logged out*/
  await store.dispatch('websocket/disconnectWS');
  await store.dispatch('user/logout');
  removeToken();

  if (!noRedirect) {
    router.push({name: 'loginPage'}).catch(() => {
    });
  }
}

const AuthUtils = {
  getToken: getToken,
  setToken: setToken,
  hasAnyAuthority: hasAnyAuthority,
  logout: logout,
};

export default AuthUtils;
