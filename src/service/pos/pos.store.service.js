import request from "@/config/request";

const baseUrl = "/api/v1/pos/store";
const PosStoreService = {
  /**
   * Kiểm tra user có quyền truy cập cửa hàng hay không
   * @param {String} params - storeGuid
   * */
  checkAccessibility(params) {
    return request.get(baseUrl + "/accessible/" + params);
  },

  /**
   * Lấy thông tin cửa hàng
   * @param {String} params - storeGuid
   * */
  getStore(params) {
    return request.get(baseUrl + "/get/" + params);
  },

  /**
   * Đóng/Mở cửa hàng
   * @param {String} payload.storeGuid
   * @param {String} payload.storeStatus
   * */
  changeStoreStatus(payload) {
    return request.put(baseUrl + "/change-status", payload);
  },
  /**
   * Đóng/Mở tính năng bảo vệ chỗ ngồi
   * @param {String} payload.storeGuid
   * @param {String} payload.storeSeatProtected
   * */
  toggleSeatProtection(payload) {
    return request.put(baseUrl + "/toggle-seat-protection", payload);
  }
};

export default PosStoreService;
