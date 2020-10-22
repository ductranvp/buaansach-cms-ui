import request from "@/config/request";
import CoreService from "@/service/shared/core.service";

const baseUrl = "api/v1/admin/product";

const AdminProductService = {
  /**
   * @param {Object} payload
   * @param {String} payload.productName
   * @param {String} payload.productNameEng
   * @param {String} payload.productUnit
   * @param {String} payload.productUnitEng
   * @param {String} payload.productDescription
   * @param {String} payload.productDescriptionEng
   * @param {String} payload.productImageUrl
   * @param {String} payload.productThumbnailUrl
   * @param {String} payload.productStatus
   * @param {String} payload.productType
   * @param {String} payload.productRootPrice
   * @param {String} payload.productPrice
   * @param {String} payload.productActivated
   * @param {String} payload.categories
   * @param {Image} image
   * */
  createProduct(payload, image) {
    const formData = CoreService.processFormDataWithImage(payload, image);
    return request.post(baseUrl + "/create", formData, CoreService.formDataConfig);
  },

  /**
   * @param {Object} payload
   * @param {String} payload.productName
   * @param {String} payload.productNameEng
   * @param {String} payload.productUnit
   * @param {String} payload.productUnitEng
   * @param {String} payload.productDescription
   * @param {String} payload.productDescriptionEng
   * @param {String} payload.productImageUrl
   * @param {String} payload.productThumbnailUrl
   * @param {String} payload.productStatus
   * @param {String} payload.productType
   * @param {String} payload.productRootPrice
   * @param {String} payload.productPrice
   * @param {String} payload.productActivated
   * @param {String} payload.categories
   * @param {Image} image
   * */
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
  },
  toggleActivation(productGuid){
    return request.put(baseUrl + "/toggle-activation", productGuid);
  }
};

export default AdminProductService;
