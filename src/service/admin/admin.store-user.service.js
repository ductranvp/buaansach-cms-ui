import request from "@/config/request";

const baseUrl = "api/v1/admin/store-user";
const AdminStoreUserService = {
  createStoreUser(payload) {
    return request.post(baseUrl + "/create", payload);
  },
  addStoreUser(payload) {
    return request.post(baseUrl + "/add", payload);
  },
  updateStoreUser(payload) {
    return request.put(baseUrl + "/update", payload);
  },
  getListStoreUserByStoreGuid(storeGuid) {
    return request.get(baseUrl + "/list-by-store/" + storeGuid);
  },
  toggleAccount(storeUserGuid) {
    return request.put(baseUrl + "/toggle-account/" + storeUserGuid);
  },
  deleteStoreUser(storeUserGuid) {
    return request.delete(baseUrl + "/delete/" + storeUserGuid);
  }
};

export default AdminStoreUserService;
