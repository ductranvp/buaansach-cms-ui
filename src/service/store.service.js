import request from "@/config/request";

const baseUrl = "api/store";
const StoreService = {
  create(payload) {
    return request.post(baseUrl + "/create", payload, {
      headers: {
        "Content-Type": undefined
      }
    });
  }
};

export default StoreService;
