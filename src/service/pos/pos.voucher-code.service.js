import request from "@/config/request";

const baseUrl = "api/v1/pos/voucher-code";
const PosVoucherCodeService = {
  getVoucherCodeInfo(params) {
    return request.get(baseUrl + "/get/" + params);
  },
  applyVoucher(payload) {
    return request.put(baseUrl + "/apply-voucher/", payload);
  },
  cancelVoucher(payload) {
    return request.put(baseUrl + "/cancel-voucher/", payload);
  },
};

export default PosVoucherCodeService;
