import request from "@/config/request";

const baseUrl = "api/v1/pos/voucher-code";
const PosVoucherCodeService = {
  getVoucherCodeInfo(params) {
    return request.get(baseUrl + "get", {
      params: params
    });
  },
};

export default PosVoucherCodeService;
