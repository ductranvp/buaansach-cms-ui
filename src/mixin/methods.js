import Constants from "@/utils/constants";
import router from "@/router";
import AuthUtils from '@/utils/auth.util';
import MessageBoxUtils from '@/utils/message-box.util';

const methods = {
  getMediaUrl(uri) {
    const mediaHost = Constants.SERVER_API_URL;
    if (uri && !uri.startsWith("http")) {
      uri = mediaHost + uri;
    }
    return uri;
  },
  pushRouteName(routeName, params){
    router.push({name: routeName, params}).catch(() => {});
  },
  pushRoutePath(routePath, params){
    router.push({path: routePath, params}).catch(() => {});
  },
  replaceRouteName(routeName, params){
    router.replace({name: routeName, params}).catch(() => {});
  },
  replaceRoutePath(routePath, params){
    router.replace({path: routePath, params}).catch(() => {});
  },
  logout(noRedirect){
    AuthUtils.logout(noRedirect);
  },
  logoutWithConfirm(noRedirect){
    MessageBoxUtils.confirm("Thoát tài khoản?", () => {
      AuthUtils.logout(noRedirect);
    });
  }
};

export default methods;
