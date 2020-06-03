import request from "@/config/request";
import CoreService from "@/service/core.service";

const baseUrl = "api/v1/admin/category";

const AdminCategoryService = {
  createCategory(payload, image) {
    const formData = CoreService.processFormDataWithImage(payload, image);
    return request.post(baseUrl + "/create", formData, CoreService.formDataConfig);
  },
  updateCategory(payload, image) {
    const formData = CoreService.processFormDataWithImage(payload, image);
    return request.put(baseUrl + "/update", formData, CoreService.formDataConfig);
  },
  getAllCategory() {
    return request.get(baseUrl + "/list");
  },
  getCategory(categoryGuid) {
    return request.get(baseUrl + "/get/" + categoryGuid);
  },
  deleteCategory(categoryGuid) {
    return request.delete(baseUrl + "/delete/" + categoryGuid);
  },
  updateCategoryPosition(payload){
    return request.put(baseUrl + "/update-position", payload);
  },
  updateListCategoryPosition(payload){
    return request.put(baseUrl + "/update-list-position", payload);
  }
};

export default AdminCategoryService;
