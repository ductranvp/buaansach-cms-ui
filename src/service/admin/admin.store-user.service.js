import request from "@/config/request";

const baseUrl = "api/v1/admin/store-user";
const AdminStoreUserService = {
  createStoreUser(payload) {
    return request.post(baseUrl + "/create", payload);
  },
  /**
   * @param {String} payload.storeGuid
   * @param {String} payload.principal
   * @param {String} payload.storeUserRole
   * @param {String} payload.storeUserStatus
   * */
  addStoreUser(payload) {
    return request.post(baseUrl + "/add", payload);
  },
  updateStoreUser(payload) {
    return request.put(baseUrl + "/update", payload);
  },
  getListStoreUserByStoreGuid(storeGuid) {
    return request.get(baseUrl + "/list-by-store/" + storeGuid);
  },
  toggleActivation(storeUserGuid) {
    return request.put(baseUrl + "/toggle-activation/" + storeUserGuid);
  },
  deleteStoreUser(storeUserGuid) {
    return request.delete(baseUrl + "/delete/" + storeUserGuid);
  }
};

export default AdminStoreUserService;
