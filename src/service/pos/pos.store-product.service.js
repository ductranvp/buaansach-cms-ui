import request from "@/config/request";

const baseUrl = "api/v1/pos/store-product";
const PosStoreProductService = {
  /**
   * Đổi trạng thái sản phẩm trong cửa hàng
   * @param {String} payload.storeGuid
   * @param {String} payload.storeProductGuid
   * @param {String} payload.storeProductStatus
   * */
  changeStoreProductStatus(payload) {
    return request.put(baseUrl + "/change-status", payload);
  }
};

export default PosStoreProductService;
