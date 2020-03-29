import request from "@/config/request";

const baseUrl = "api/store";
const StoreService = {
  createStore(payload) {
    return request.post(baseUrl + "/create", payload, {
      headers: {
        "Content-Type": undefined
      }
    });
  },
  updateStore(payload) {
    return request.put(baseUrl + "/update", payload, {
      headers: {
        "Content-Type": undefined
      }
    });
  },
  getListStore(params) {
    return request.get(baseUrl + "/list", {
      params: params
    });
  },
  getStore(params) {
    return request.get(baseUrl + "/get/" + params);
  },
  deleteStore(params) {
    return request.delete(baseUrl + "/delete/" + params);
  }
};

export default StoreService;
