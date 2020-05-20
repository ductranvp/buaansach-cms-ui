import request from "@/config/request";

const baseUrl = "api/v1/pos/store-product";
const PosStoreProductService = {
  getListStoreProductByStoreGuid(params) {
    return request.get(baseUrl + "/list-by-store/" + params);
  },
  changeStoreProductStatus(payload) {
    return request.put(baseUrl + "/change-status", payload);
  }
};

export default PosStoreProductService;
