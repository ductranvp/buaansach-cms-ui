import request from "@/config/request";

const baseUrl = "api/v1/pos/order";
const PosOrderService = {
  createOrder(payload) {
    return request.post(baseUrl + "/create", payload);
  },
  updateOrder(payload) {
    return request.put(baseUrl + "/update", payload);
  },
  // getOrder(params) {
  //   return request.get(baseUrl + "/get/" + params);
  // },
  getSeatCurrentOrder(params) {
    return request.get(baseUrl + "/get-seat-order/" + params);
  },
  changeOrderSeat(payload) {
    return request.put(baseUrl + "/change-seat", payload);
  },
  receiveOrder(payload) {
    return request.put(baseUrl + "/receive", payload);
  },
  purchaseOrder(payload) {
    return request.put(baseUrl + "/purchase", payload);
  },
  cancelOrder(payload) {
    return request.put(baseUrl + "/cancel", payload);
  },
  changeCustomerPhone(payload) {
    // seatGuid, orderGuid, newCustomerPhone
    return request.put(baseUrl + "/change-customer-phone", payload);
  }
};

export default PosOrderService;
