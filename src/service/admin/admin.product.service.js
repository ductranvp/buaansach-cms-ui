import request from "@/config/request";
import CoreService from "@/service/core.service";

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
  getListProductNotInStore(params) {
    return request.get(baseUrl + "/list-not-in-store/" + params);
  },
  getProduct(productGuid) {
    return request.get(baseUrl + "/get/" + productGuid);
  },
  deleteProduct(productGuid) {
    return request.delete(baseUrl + "/delete/" + productGuid);
  }
};

export default AdminProductService;
