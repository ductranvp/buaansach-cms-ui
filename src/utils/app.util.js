import store from "@/store";
import Roles from "@/config/security/roles";
import Constants from "@/utils/constants";
import i18n from "@/i18n";

function redirectBasedOnRole() {
  if (store.getters.roles.includes(Roles.ADMIN)) return "/admin";
  else if (store.getters.roles.includes(Roles.MANAGER)) return "/manager";
  else if (store.getters.roles.includes(Roles.EMPLOYEE)) return "/employee";
  else return "/";
}

function generatePageTitle(pageTitle) {
  const title = Constants.APP_TITLE;
  if (pageTitle) {
    return `${i18n.t(pageTitle)} - ${i18n.t(title)}`;
  }
  return `${i18n.t(title)}`;
}

function deepCopy(object) {
  return JSON.parse(JSON.stringify(object));
}

const AppUtils = {
  redirectBasedOnRole: redirectBasedOnRole,
  generatePageTitle: generatePageTitle,
  deepCopy: deepCopy
};

export default AppUtils;
