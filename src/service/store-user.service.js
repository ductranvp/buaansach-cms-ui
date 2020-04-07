import request from "@/config/request";

const baseUrl = "api/v1/store-user";
const StoreUserService = {
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
  }
};

export default StoreUserService;
