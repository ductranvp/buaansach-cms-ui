import request from "@/config/request";

const baseUrl = "api/v1/pos/order-product";
const PosOrderProductService = {
  /**
   * Lấy danh sách sản phẩm đã gọi theo đơn hàng
   * @param {String} params - orderGuid
   * */
  getOrderProductByOrderGuid(params){
    return request.get(baseUrl + "/list-by-order/" + params);
  },

  /**
   * Phục vụ 1 sản phẩm đã gọi
   * @param {String} payload.storeGuid
   * @param {String} payload.orderProductGuid
   * */
  serveOrderProduct(payload) {
    return request.put(baseUrl + "/serve", payload);
  },

  /**
   * Phục vụ toàn bộ sản phẩm đang chuẩn bị
   * @param {String} payload.storeGuid
   * @param {String} payload.orderGuid
   * @param {Array<String>} payload.listOrderProductGuid
   * */
  serveAllOrderProduct(payload) {
    return request.put(baseUrl + "/serve-all", payload);
  },

  /**
   * Hủy 1 sản phẩm đã gọi
   * @param {String} payload.storeGuid
   * @param {String} payload.orderProductGuid
   * @param {String} payload.orderProductCancelReason
   * */
  cancelOrderProduct(payload) {
    return request.put(baseUrl + "/cancel", payload);
  }
};

export default PosOrderProductService;
