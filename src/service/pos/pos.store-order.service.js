import request from "@/config/request";

const baseUrl = "api/v1/pos/store-order";
const PosStoreOrderService = {
  getListStoreOrder(params) {
    return request.get(baseUrl + "/list-by-store", {
      params: params
    });
  },
  updateStoreOrder(payload) {
    return request.put(baseUrl + "/update-status", payload);
  },
  toggleVisibility(payload) {
    return request.put(baseUrl + "/toggle-visibility", payload);
  },
};

export default PosStoreOrderService;
