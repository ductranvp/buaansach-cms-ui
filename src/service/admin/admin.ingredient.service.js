import request from "@/config/request";
import CoreService from "@/service/shared/core.service";

const baseUrl = "api/v1/admin/ingredient";

const AdminIngredientService = {
  createIngredient(payload, image) {
    const formData = CoreService.processFormDataWithImage(payload, image);
    return request.post(
      baseUrl + "/create",
      formData,
      CoreService.formDataConfig
    );
  },
  updateIngredient(payload, image) {
    const formData = CoreService.processFormDataWithImage(payload, image);
    return request.put(
      baseUrl + "/update",
      formData,
      CoreService.formDataConfig
    );
  },
  getIngredients() {
    return request.get(baseUrl + "/list");
  },
  deleteIngredient(ingredientGuid) {
    return request.delete(baseUrl + "/delete/" + ingredientGuid);
  }
};

export default AdminIngredientService;
