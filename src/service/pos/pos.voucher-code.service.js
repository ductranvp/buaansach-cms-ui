import request from "@/config/request";

const baseUrl = "api/v1/pos/voucher-code";
const PosVoucherCodeService = {
  /**
   * @param {String} payload.orderGuid
   * @param {String} payload.customerPhone
   * @param {String} payload.voucherCode
   * */
  applyVoucher(payload) {
    return request.put(baseUrl + "/apply-voucher/", payload);
  },

  /**
   * @param {String} payload.orderGuid
   * @param {String} payload.customerPhone
   * @param {String} payload.voucherCode
   * */
  cancelVoucher(payload) {
    return request.put(baseUrl + "/cancel-voucher/", payload);
  }
};

export default PosVoucherCodeService;
