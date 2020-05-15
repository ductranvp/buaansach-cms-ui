import request from "@/config/request";

const baseUrl = "api/v1/customer-care/customer-voucher-code";
const CustomerCareCustomerVoucherCodeService = {
  getListCustomerCode(params) {
    return request.get(baseUrl + "/list", {
      params: params
    });
  },
  getUnsentVoucher() {
    return request.get(baseUrl + "/list-unsent-voucher");
  }
};

export default CustomerCareCustomerVoucherCodeService;
