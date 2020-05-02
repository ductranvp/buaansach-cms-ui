import request from "@/config/request";

const baseUrl = "api/v1/admin/voucher-inventory";

const AdminVoucherInventoryService = {
  generateVoucherInventory(payload) {
    //voucherCodeLength
    //numberOfVoucherCode
    return request.post(baseUrl + "/generate", payload);
  },
  getVoucherInventoryStatus(){
    return request.get(baseUrl + "/status");
  }
};

export default AdminVoucherInventoryService;
