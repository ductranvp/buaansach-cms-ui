import request from "@/config/request";

const baseUrl = "api/v1/admin/voucher";

const AdminVoucherService = {
  createVoucher(payload) {
    return request.post(baseUrl + "/create", payload);
  },
  updateVoucher(payload) {
    return request.put(baseUrl + "/create", payload);
  },
  getListVoucher(params) {
    return request.get(baseUrl + "/list", {
      params: params
    });
  },
  getListVoucherCode(params) {
    return request.get(baseUrl + "/list-voucher-code/" + params);
  },
  toggleVoucher(params) {
    return request.put(baseUrl + "/toggle-voucher", params);
  }
};

export default AdminVoucherService;
