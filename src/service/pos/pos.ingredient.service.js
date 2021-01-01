import request from "@/config/request";

const baseUrl = "api/v1/pos/ingredient";
const PosIngredientService = {
  getIngredients() {
    return request.get(baseUrl + "/list");
  }
};

export default PosIngredientService;
