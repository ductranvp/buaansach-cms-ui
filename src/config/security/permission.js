import router from "@/router";
import NProgress from "nprogress"; // progress bar
import "@/assets/styles/nprogress.scss"; // progress bar style
import AuthUtils from "@/utils/auth.util"; // get token from cookie
import AppUtils from "@/utils/app.util";
import store from "@/store";
import StorageKey from "@/utils/storage-key";

NProgress.configure({ showSpinner: true }); // NProgress Configuration

router.beforeEach(async (to, from, next) => {
  /* Start progress bar */
  NProgress.start();

  /* Set page title */
  document.title = AppUtils.generatePageTitle(to.meta.title);

  /* If no route matched => not found */
  if (!to.matched.length) {
    next({ name: "notFoundPage" });
  }

  /* If need authorities */
  if (to.meta && to.meta.roles && to.meta.roles.length > 0) {
    console.log("test");
    /* and have a token => check role */
    if (AuthUtils.getToken()) {
      /* If roles is not saved in store or page is refreshed
       * call api to get account info first then check roles,
       * else just check the roles */
      if (!store.state.websocket.hasExecutedConnect) {
        await store.dispatch("websocket/connectWS");
      }
      if (!store.state.user.authorities.length) {
        try {
          await store.dispatch("user/getAccount");
        } catch (error) {
          const errorCode = AppUtils.getNumberErrorCode(error);
          if (errorCode === 401) {
            // Nếu gặp lỗi 401 thì nhảy về trang login
            await AuthUtils.logout();
            // return để không chạy tiếp các lệnh bên dưới
            return;
          }
        }
      }
      /* If user has requested role */
      if (AuthUtils.hasAnyAuthority(to.meta.roles)) {
        next();
      } else {
        next({ name: "forbiddenPage" });
      }
    } else {
      /* and have no token => login */
      sessionStorage.setItem(
        StorageKey.sessionStorageKeys.REQUESTED_URL,
        to.fullPath
      );
      next({ name: "loginPage" });
    }
  } else {
    if (AuthUtils.getToken()) {
      if (!store.state.user.authorities.length) {
        try {
          await store.dispatch("user/getAccount");
        } catch (error) {
          await AuthUtils.logout(true);
        }
      }
    }
    /* No authorities, so just proceed */
    next();
  }
});

router.afterEach(() => {
  // Finish progress bar
  NProgress.done();
});
