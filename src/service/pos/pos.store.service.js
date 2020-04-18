import request from "@/config/request";

const baseUrl = "/api/v1/pos/store";
const PosStoreService = {
  checkAccessibility(params) {
    return request.get(baseUrl + "/accessible/" + params);
  },
};

export default PosStoreService;
