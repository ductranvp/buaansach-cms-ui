import request from "@/config/request";
import CoreService from "@/service/core.service";

const baseUrl = "api/v1/account";
const AccountService = {
  authenticate(payload) {
    return request.post(baseUrl + "/authenticate", payload);
  },
  getAccountInfo() {
    return request.get(baseUrl + "/info");
  },
  updateAccount(payload) {
    return request.put(baseUrl + "/update", payload, CoreService.formDataConfig);
  },
  changePassword(payload) {
    return request.post(baseUrl + "/change-password", payload);
  },
  resetPasswordInit(payload) {
    return request.post(baseUrl + "/reset-password/init", payload);
  },
  resetPasswordFinish(payload) {
    return request.post(baseUrl + "/reset-password/finish", payload);
  }
};

export default AccountService;
