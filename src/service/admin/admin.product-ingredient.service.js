import request from "@/config/request";

const baseUrl = "api/v1/admin/product-ingredient";

const AdminProductIngredientService = {
  createByProduct(payload) {
    return request.post(baseUrl + "/create-by-product", payload);
  },
  createByIngredient(payload) {
    return request.post(baseUrl + "/create-by-ingredient", payload);
  },
  getByProduct(productGuid) {
    return request.get(baseUrl + "/list-by-product/" + productGuid);
  },
  getByIngredient(ingredientGuid) {
    return request.get(baseUrl + "/list-by-ingredient/" + ingredientGuid);
  }
};

export default AdminProductIngredientService;
