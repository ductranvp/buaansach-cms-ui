import request from "@/config/request";

const baseUrl = "api/v1/admin/store-product";
const AdminStoreProductService = {
  addStoreProduct(payload) {
    return request.post(baseUrl + "/add", payload);
  },
  updateStoreProduct(payload) {
    return request.put(baseUrl + "/update", payload);
  },
  removeStoreProduct(storeGuid, productGuid) {
    return request.delete(baseUrl + "/remove", {
      params: {
        storeGuid: storeGuid,
        productGuid: productGuid
      }
    });
  }
};

export default AdminStoreProductService;
