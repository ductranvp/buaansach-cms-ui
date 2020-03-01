import request from "@/config/request";

const baseUrl = "api/account";
const AccountService = {
  authenticate(payload) {
    return request.post(baseUrl + "/authenticate", JSON.stringify(payload));
  },
  getInfo() {
    return request.get(baseUrl + "/info");
  },
  update(payload) {
    return request.put(baseUrl + "/update", payload, {
      headers: {
        "Content-Type": undefined
      }
    });
  },
  changePassword(payload) {
    return request.post(baseUrl + "/change_password", JSON.stringify(payload));
  },
  resetPasswordInit(payload) {
    return request.post(baseUrl + "/reset-password/init", payload);
  },
  resetPasswordFinish(payload) {
    return request.post(baseUrl + "/reset-password/finish", payload);
  }
};

export default AccountService;
