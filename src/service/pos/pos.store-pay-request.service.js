import request from "@/config/request";

const baseUrl = "api/v1/pos/store-pay-request";
const PosStorePayRequestService = {
  /**
   * Lấy danh sách store pay request
   * @param {String} params.storeGuid - Mã UUID của cửa hàng
   * @param {Date} params.startDate - Ngày bắt đầu
   * @param {Boolean} params.hidden - Trạng thái ẩn / hiện
   * */
  getListStorePayRequest(params) {
    return request.get(baseUrl + "/list-by-store", {
      params: params
    });
  },
  /**
   * Cập nhật store pay request
   * @param {String} payload.guid - Mã UUID của StorePayRequestEntity
   * @param {String} payload.storePayRequestStatus - Trạng thái của store pay request SEEN / UNSEEN
   * */
  updateStorePayRequest(payload) {
    return request.put(baseUrl + "/update-status", payload);
  },
  /**
   * Ẩn/hiện store pay request
   * @param {String} payload.storeGuid - Mã UUID của cửa hàng
   * @param {Array<String>} payload.listGuid - Mảng UUID của StorePayRequestEntity
   * @param {Boolean} payload.hidden - Trạng thái ẩn / hiện
   * */
  toggleVisibility(payload) {
    return request.put(baseUrl + "/toggle-visibility", payload);
  },
};

export default PosStorePayRequestService;
