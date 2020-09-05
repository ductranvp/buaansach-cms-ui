import request from "@/config/request";
import CoreService from "@/service/shared/core.service";

const baseUrl = "api/v1/admin/category";

const AdminCategoryService = {
  /**
   * @param {Object} payload
   * @param {String} payload.categoryName
   * @param {String} payload.categoryNameEng
   * @param {Image} image
   * */
  createCategory(payload, image) {
    const formData = CoreService.processFormDataWithImage(payload, image);
    return request.post(baseUrl + "/create", formData, CoreService.formDataConfig);
  },

  /**
   * @param {Object} payload
   * @param {String} payload.categoryName
   * @param {String} payload.categoryNameEng
   * @param {Image} image
   * */
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
  updateCategoryPosition(payload) {
    return request.put(baseUrl + "/update-position", payload);
  },
  updateListCategoryPosition(payload) {
    return request.put(baseUrl + "/update-list-position", payload);
  }
};

export default AdminCategoryService;
