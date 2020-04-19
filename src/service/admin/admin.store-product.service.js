import request from "@/config/request";

const baseUrl = "api/v1/admin/store-product";
const AdminStoreProductService = {
  addStoreProduct(payload) {
    return request.post(baseUrl + "/add", payload);
  },
  addAllStoreProduct(payload) {
    return request.post(baseUrl + "/add-all", payload);
  },
  getListStoreProductByStoreGuid(storeGuid) {
    return request.get(baseUrl + "/list-by-store/" + storeGuid);
  },
  updateStoreProduct(payload) {
    return request.put(baseUrl + "/update", payload);
  },
  deleteStoreProduct(params) {
    return request.delete(baseUrl + "/delete/" + params);
  }
};

export default AdminStoreProductService;
