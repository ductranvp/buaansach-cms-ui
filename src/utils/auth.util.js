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
    localStorage.setItem(accessToken, token);
    // sessionStorage.setItem(accessToken, token);
  }
}

function removeToken() {
  sessionStorage.removeItem(accessToken);
  localStorage.removeItem(accessToken);
}

function hasAnyAuthority(authorities) {
  for (let i = 0; i < authorities.length; i++) {
    if (store.state.user.authorities.includes(authorities[i])) {
      return true;
    }
  }
  return false;
}

async function logout(noRedirect, redirectRouteName) {
  /*routeName is the route that we want to redirect to when logged out*/
  await store.dispatch('websocket/disconnectWS');
  await store.dispatch('user/logout');
  removeToken();

  if (!noRedirect) {
    const routeName = redirectRouteName ? redirectRouteName : 'loginPage';
    router.push({name: routeName}).catch(() => {
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
