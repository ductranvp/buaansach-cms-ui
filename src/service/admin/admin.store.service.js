import request from "@/config/request";
import CoreService from "@/service/core.service";

const baseUrl = "api/v1/admin/store";

const AdminStoreService = {
  createStore(payload, image) {
    const formData = CoreService.processFormDataWithImage(payload, image);
    return request.post(baseUrl + "/create", formData, CoreService.formDataConfig);
  },
  updateStore(payload, image) {
    const formData = CoreService.processFormDataWithImage(payload, image);
    return request.put(baseUrl + "/update", formData, CoreService.formDataConfig);
  },
  getListStore(params) {
    return request.get(baseUrl + "/list", {
      params: params
    });
  },
  getAllStore() {
    return request.get(baseUrl + "/list-all");
  },
  getStore(storeGuid) {
    return request.get(baseUrl + "/get/" + storeGuid);
  },
  deleteStore(storeGuid) {
    return request.delete(baseUrl + "/delete/" + storeGuid);
  }
};

export default AdminStoreService;
