import store from "@/store";
import Roles from "@/config/security/roles";
import Constants from "@/utils/constants";
import i18n from "@/i18n";

function redirectBasedOnRole() {
  if (store.getters.roles.includes(Roles.ADMIN)) return "/admin";
  else return "/user";
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

function setAttrs(vm, currentObj, newObj){
  Object.keys(newObj).forEach(key => {
    vm.$set(currentObj, key, newObj[key]);
  });
}

const AppUtils = {
  redirectBasedOnRole: redirectBasedOnRole,
  generatePageTitle: generatePageTitle,
  deepCopy: deepCopy,
  setAttrs: setAttrs
};

export default AppUtils;
