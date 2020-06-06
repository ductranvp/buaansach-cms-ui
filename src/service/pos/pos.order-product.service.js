import request from "@/config/request";

const baseUrl = "api/v1/pos/order-product";
const PosOrderProductService = {
  getOrderProductByOrderGuid(params){
    return request.get(baseUrl + "/list-by-order/" + params);
  },
  serveOrderProduct(payload) {
    return request.put(baseUrl + "/serve", payload);
  },
  serveAllOrderProduct(payload) {
    return request.put(baseUrl + "/serve-all", payload);
  },
  cancelOrderProduct(payload) {
    return request.put(baseUrl + "/cancel", payload);
  }
};

export default PosOrderProductService;
