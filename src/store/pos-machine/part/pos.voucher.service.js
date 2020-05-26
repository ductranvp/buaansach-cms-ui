import request from "@/config/request";

const baseUrl = "api/v1/pos/voucher";
const PosVoucherService = {
  getFirstRegisterVoucher() {
    return request.get(baseUrl + "/get-first-register-voucher");
  }
};

export default PosVoucherService;
