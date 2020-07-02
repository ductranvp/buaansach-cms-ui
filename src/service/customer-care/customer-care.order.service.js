import request from "@/config/request";

const baseUrl = "api/v1/customer-care/order";
const CustomerCareOrderService = {
  getOrderInfo(params){
    return request.get(baseUrl + "/get/" + params);
  }
};

export default CustomerCareOrderService;
