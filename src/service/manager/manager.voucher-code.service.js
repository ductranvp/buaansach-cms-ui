import request from "@/config/request";

const baseUrl = "api/v1/manager/voucher-code";
const ManagerVoucherCodeService = {
  updateVoucherCode(payload) {
    return request.put(baseUrl + "/update-voucher-code", payload);
  },
};

export default ManagerVoucherCodeService;
