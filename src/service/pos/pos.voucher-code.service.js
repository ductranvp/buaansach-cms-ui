import request from "@/config/request";

const baseUrl = "api/v1/pos/voucher-code";
const PosVoucherCodeService = {
  applyVoucher(payload) {
    return request.put(baseUrl + "/apply-voucher/", payload);
  },
  cancelVoucher(payload) {
    return request.put(baseUrl + "/cancel-voucher/", payload);
  },
};

export default PosVoucherCodeService;
