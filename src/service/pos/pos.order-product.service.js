import request from "@/config/request";

const baseUrl = "api/v1/pos/order-product";
const PosOrderProductService = {
  serveOrderProduct(payload) {
    return request.put(baseUrl + "/serve", payload);
  },
  cancelOrderProduct(payload) {
    return request.put(baseUrl + "/cancel", payload);
  }
};

export default PosOrderProductService;
