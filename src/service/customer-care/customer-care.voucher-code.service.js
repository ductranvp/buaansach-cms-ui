import request from "@/config/request";

const baseUrl = "api/v1/customer-care/voucher-code";
const CustomerCareVoucherCodeService = {
  updateVoucherCode(payload) {
    return request.put(baseUrl + "/update-voucher-code", payload);
  },
};

export default CustomerCareVoucherCodeService;
