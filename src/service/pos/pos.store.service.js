import request from "@/config/request";

const baseUrl = "/api/v1/pos/store";
const PosStoreService = {
  checkAccessibility(params) {
    return request.get(baseUrl + "/accessible/" + params);
  },
  getStore(params) {
    return request.get(baseUrl + "/get/" + params);
  },
  changeStoreStatus(payload) {
    return request.put(baseUrl + "/change-status", payload);
  },
};

export default PosStoreService;
