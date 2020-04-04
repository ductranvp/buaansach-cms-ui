import request from "@/config/request";

const baseUrl = "api/v1/store";
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
  getStore(storeGuid) {
    return request.get(baseUrl + "/get/" + storeGuid);
  },
  deleteStore(storeGuid) {
    return request.delete(baseUrl + "/delete/" + storeGuid);
  },
  changeStoreOwner(payload) {
    return request.put(baseUrl + "/change-owner", payload);
  }
};

export default StoreService;
