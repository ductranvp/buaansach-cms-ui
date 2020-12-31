import request from "@/config/request";
import CoreService from "@/service/shared/core.service";

const baseUrl = "api/v1/admin/recipe";

const AdminRecipeService = {
  createRecipe(payload, image) {
    const formData = CoreService.processFormDataWithImage(payload, image);
    return request.post(
      baseUrl + "/create",
      formData,
      CoreService.formDataConfig
    );
  },
  updateRecipe(payload, image) {
    const formData = CoreService.processFormDataWithImage(payload, image);
    return request.put(
      baseUrl + "/update",
      formData,
      CoreService.formDataConfig
    );
  },
  getRecipes() {
    return request.get(baseUrl + "/list");
  },
  deleteRecipe(recipeGuid) {
    return request.delete(baseUrl + "/delete/" + recipeGuid);
  }
};

export default AdminRecipeService;
