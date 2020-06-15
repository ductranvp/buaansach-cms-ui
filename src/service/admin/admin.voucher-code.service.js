import request from "@/config/request";

const baseUrl = "api/v1/admin/voucher-code";

const AdminVoucherCodeService = {
  toggleVoucherCode(payload) {
    return request.put(baseUrl + "/toggle-voucher-code", payload);
  },
  updateVoucherCode(payload) {
    return request.put(baseUrl + "/update", payload);
  }
};

export default AdminVoucherCodeService;
