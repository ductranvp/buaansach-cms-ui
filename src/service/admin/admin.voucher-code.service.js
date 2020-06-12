import request from "@/config/request";

const baseUrl = "api/v1/admin/voucher-code";

const AdminVoucherCodeService = {
  toggleVoucherCode(params) {
    return request.put(baseUrl + "/toggle-voucher-code", params);
  }
};

export default AdminVoucherCodeService;
