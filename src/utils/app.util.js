import store from "@/store";
import Roles from "@/security/roles";
import Constants from "@/utils/constants";

function redirectBasedOnRole() {
  if (store.getters.roles.includes(Roles.ADMIN)) return "/admin";
  else if (store.getters.roles.includes(Roles.MANAGER)) return "/manager";
  else if (store.getters.roles.includes(Roles.EMPLOYEE)) return "/employee";
  else return "/";
}

function generatePageTitle(pageTitle) {
  const title = Constants.APP_TITLE;
  if (pageTitle) {
    return `${pageTitle} - ${title}`;
  }
  return `${title}`;
}

const AppUtils = {
  redirectBasedOnRole: redirectBasedOnRole,
  generatePageTitle: generatePageTitle
};

export default AppUtils;
