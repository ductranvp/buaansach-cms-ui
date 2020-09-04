import request from "@/config/request";
import CoreService from "@/service/shared/core.service";

const baseUrl = "api/v1/admin/product";

const AdminProductService = {
  createProduct(payload, image) {
    const formData = CoreService.processFormDataWithImage(payload, image);
    return request.post(baseUrl + "/create", formData, CoreService.formDataConfig);
  },
  updateProduct(payload, image) {
    const formData = CoreService.processFormDataWithImage(payload, image);
    return request.put(baseUrl + "/update", formData, CoreService.formDataConfig);
  },
  getListProduct(params) {
    return request.get(baseUrl + "/list", {
      params: params
    });
  },
  getAllProduct() {
    return request.get(baseUrl + "/list-all");
  },
  getListProductNotInStore(params) {
    return request.get(baseUrl + "/list-not-in-store/" + params);
  },
  getProduct(productGuid) {
    return request.get(baseUrl + "/get/" + productGuid);
  },
  deleteProduct(productGuid) {
    return request.delete(baseUrl + "/delete/" + productGuid);
  },
  updateProductPosition(payload){
    return request.put(baseUrl + "/update-position", payload);
  },
  updateListProductPosition(payload){
    return request.put(baseUrl + "/update-list-position", payload);
  }
};

export default AdminProductService;
