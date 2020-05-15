import request from "@/config/request";

const baseUrl = "api/v1/manager/customer-voucher-code";
const ManagerCustomerVoucherCodeService = {
  getListCustomerCode(params) {
    return request.get(baseUrl + "/list", {
      params: params
    });
  },
  getUnsentVoucher() {
    return request.get(baseUrl + "/list-unsent-voucher");
  }
};

export default ManagerCustomerVoucherCodeService;
