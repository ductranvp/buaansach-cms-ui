import request from "@/config/request";

const baseUrl = "api/v1/pos/customer";
const PosCustomerService = {
  createCustomer(payload) {
    return request.post(baseUrl + "/create", payload);
  },
  getCustomerByPhone(params) {
    return request.get(baseUrl + "/get/" + params);
  },
};

export default PosCustomerService;
