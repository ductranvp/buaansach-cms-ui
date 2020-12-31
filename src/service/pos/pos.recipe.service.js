import request from "@/config/request";
import CoreService from "@/service/shared/core.service";

const baseUrl = "api/v1/pos/recipe";

const PosRecipeService = {
  getRecipes() {
    return request.get(baseUrl + "/list");
  }
};

export default PosRecipeService;
