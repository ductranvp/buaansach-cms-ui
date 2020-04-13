import router from "@/router";
import NProgress from "nprogress"; // progress bar
import "@/assets/styles/nprogress.scss"; // progress bar style
import AuthUtils from "@/utils/auth.util"; // get token from cookie
import AppUtils from "@/utils/app.util";
import store from "@/store";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

router.beforeEach(async (to, from, next) => {
  /* Start progress bar */
  NProgress.start();

  /* Set page title */
  document.title = AppUtils.generatePageTitle(to.meta.title);

  /* If no route matched => not found */
  if (!to.matched.length) {
    next("/not-found");
  }

  /* If need authorities */
  if (to.meta && to.meta.roles && to.meta.roles.length > 0) {
    /* and have a token => check role */
    if (AuthUtils.getToken()) {
      /* If roles is not saved in store or page is refreshed
       * call api to get account info first then check roles,
       * else just check the roles */
      if (!store.getters.roles.length) {
        await store.dispatch("user/getAccount");
      }
      /* If user has requested role */
      if (AuthUtils.hasAnyAuthority(to.meta.roles)) {
        next();
      } else {
        next("/forbidden");
      }
    } else {
      /* and have no token => login */
      sessionStorage.setItem("requested-url", to.fullPath);
      next("/login");
    }
  } else {
    if (AuthUtils.getToken()) {
      if (!store.getters.roles.length) {
        await store.dispatch("user/getAccount");
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
