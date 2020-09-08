import request from "@/config/request";

const baseUrl = "api/v1/pos/order";
const PosOrderService = {
  /**
   * Tạo đơn tại vị trí
   * @param {String} payload.seatGuid
   * */
  createOrder(payload) {
    return request.post(baseUrl + "/create", payload);
  },

  /**
   * Lưu sản phẩm
   * @param {String} payload.orderGuid
   * @param {Array<Object>} payload.listOrderProduct
   * */
  updateOrder(payload) {
    return request.put(baseUrl + "/update", payload);
  },

  /**
   * Lấy thông tin đơn theo vị trí
   * @param {String} params - seatGuid
   * */
  getSeatOrder(params) {
    return request.get(baseUrl + "/get-seat-order/" + params);
  },

  /**
   * Chuyển đơn tới vị trí khác
   * @param {String} payload.currentSeatGuid
   * @param {String} payload.newSeatGuid
   * @param {String} payload.orderGuid
   * */
  changeOrderSeat(payload) {
    return request.put(baseUrl + "/change-seat", payload);
  },

  /**
   * Tiếp nhận đơn
   * @param {String} payload - orderGuid
   * */
  receiveOrder(payload) {
    return request.put(baseUrl + "/receive", payload);
  },

  /**
   * Thanh toán đơn
   * @param {String} payload.orderGuid
   * @param {String} payload.paymentMethod
   * @param {String} payload.paymentNote
   * */
  purchaseOrder(payload) {
    return request.put(baseUrl + "/purchase", payload);
  },

  /**
   * Hủy đơn
   * @param {String} payload.orderGuid
   * @param {String} payload.cancelReason
   * */
  cancelOrder(payload) {
    return request.put(baseUrl + "/cancel", payload);
  }
};

export default PosOrderService;
