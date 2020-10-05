import store from "@/store";
import Roles from "@/config/security/roles";
import Constants from "@/utils/constants";
import i18n from "@/i18n";

function redirectBasedOnRole() {
  if (store.state.user.authorities.includes(Roles.ADMIN)) return "/admin";
  if (store.state.user.authorities.includes(Roles.MODERATOR)) return "/moderator";
  if (store.state.user.authorities.includes(Roles.PARTNER)) return "/partner";
  if (store.state.user.authorities.includes(Roles.CUSTOMER_CARE)) return "/customer-care";
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
  Object.keys(newObj).forEach(key => {
    vm.$set(currentObj, key, newObj[key]);
  });
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

function getNumberErrorCode(error){
  if (!error) return -1;
  return error.status || error.data.status;
}

function getStringErrorCode(error){
  if (!error) return "";
  return error.message || error.data.message;
}

const AppUtils = {
  redirectBasedOnRole: redirectBasedOnRole,
  generatePageTitle: generatePageTitle,
  deepCopy: deepCopy,
  setAttrs: setAttrs,
  parseCloudFlareTrace: parseCloudFlareTrace,
  getNumberErrorCode: getNumberErrorCode,
  getStringErrorCode: getStringErrorCode,
};

export default AppUtils;
