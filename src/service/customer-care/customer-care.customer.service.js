import request from "@/config/request";

const baseUrl = "api/v1/customer-care/customer";
const CustomerCareCustomerService = {
  updateCustomer(payload) {
    return request.put(baseUrl + "/update-customer", payload);
  },
  getStatistic(payload){
    return request.post(baseUrl + "/statistic", payload);
  }
};

export default CustomerCareCustomerService;
