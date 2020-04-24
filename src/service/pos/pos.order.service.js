import request from "@/config/request";

const baseUrl = "api/v1/pos/order";
const PosOrderService = {
  createOrder(payload) {
    return request.post(baseUrl + "/create", payload);
  },
  saveOrder(payload) {
    return request.put(baseUrl + "/save", payload);
  },
  getOrder(params) {
    return request.get(baseUrl + "/get/" + params);
  },
  getOrderBySeatGuid(params) {
    return request.get(baseUrl + "/get-by-seat/" + params);
  },
  moveOrder(payload) {
    return request.put(baseUrl + "/move", payload);
  },
  receiveOrder(payload) {
    return request.put(baseUrl + "/receive", payload);
  },
  purchaseOrder(payload) {
    return request.put(baseUrl + "/purchase", payload);
  },
  cancelOrder(payload) {
    return request.put(baseUrl + "/cancel", payload);
  }
};

export default PosOrderService;
