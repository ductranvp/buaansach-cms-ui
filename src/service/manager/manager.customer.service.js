import request from "@/config/request";

const baseUrl = "api/v1/manager/customer";
const ManagerCustomerService = {
  updateCustomer(payload) {
    return request.put(baseUrl + "/update-customer", payload);
  },
};

export default ManagerCustomerService;
