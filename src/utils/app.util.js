import store from "@/store";
import Roles from "@/config/security/roles";
import Constants from "@/utils/constants";
import i18n from "@/i18n";

function redirectBasedOnRole() {
  if (store.getters.roles.includes(Roles.ADMIN)) return "/admin";
  if (store.getters.roles.includes(Roles.MANAGER)) return "/manager";
  if (store.getters.roles.includes(Roles.CUSTOMER_CARE)) return "/customer-care";
  else return "/home";
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

function setAttrs(vm, currentObj, newObj) {
  const temp = deepCopy(currentObj);
  Object.keys(newObj).forEach(key => {
    vm.$set(currentObj, key, newObj[key]);
  });
  vm.$set(currentObj, "createdBy", temp['createdBy']);
  vm.$set(currentObj, "createdDate", temp['createdDate']);
}

function parseCloudFlareTrace(trace){
  let lines = trace.trim().split("\n");
  let data = {};
  lines.forEach(line => {
    let pair = line.trim().split("=");
    const key = pair[0];
    const value = pair[1];
    data[key] = value;
  });
  return data;
}

const AppUtils = {
  redirectBasedOnRole: redirectBasedOnRole,
  generatePageTitle: generatePageTitle,
  deepCopy: deepCopy,
  setAttrs: setAttrs,
  parseCloudFlareTrace: parseCloudFlareTrace
};

export default AppUtils;
