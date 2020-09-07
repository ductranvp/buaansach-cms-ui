import request from "@/config/request";

const baseUrl = "api/v1/pos/store-user";
const PosStoreUserService = {
  /**
   * @param {String} params - storeGuid
   * */
  getStoreUser(params) {
    return request.get(baseUrl + "/get/" + params);
  },

  /**
   * @param {String} params - storeGuid
   * */
  getCurrentStoreUserRole(params) {
    return request.get(baseUrl + "/get-current-store-user-role/" + params);
  },
};

export default PosStoreUserService;
