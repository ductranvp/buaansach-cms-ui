import request from "@/config/request";

const baseUrl = "api/v1/customer-care/customer-order";
const CustomerCareCustomerOrderService = {
  getListCustomerOrder(payload){
    return request.post(baseUrl + "/list-with-filter", payload);
  },
  updateCustomerOrder(payload){
    return request.put(baseUrl + "/update", payload);
  }
};

export default CustomerCareCustomerOrderService;
