import request from "@/config/request";

const baseUrl = "api/v1/pos/store-notification";
const PosStoreNotificationService = {
  /**
   * Lấy danh sách thông báo
   * @param {String} params.storeGuid
   * @param {String} params.listArea
   * @param {String} params.startDate
   * @param {String} params.type
   * @param {Boolean} params.hidden
   * */
  getListStoreNotification(params){
    return request.get(baseUrl + "/list-by-store", {
      params
    });
  },

  /**
   * Đổi trạng thái thông báo
   * @param {String} payload.guid
   * @param {String} payload.storeNotificationStatus
   * */
  updateStoreNotification(payload){
    return request.put(baseUrl + "/update-status", payload);
  },

  /**
   * Ẩn/Hiện thông báo
   * @param {String} payload.storeGuid
   * @param {Array<String>} payload.listGuid
   * @param {Boolean} payload.hidden
   * */
  toggleVisibility(payload){
    return request.put(baseUrl + "/toggle-visibility", payload);
  },

  /**
   * Ẩn/Hiện thông báo
   * @param {String} notificationGuid
   * */
  togglePin(notificationGuid){
    return request.put(baseUrl + "/toggle-pin", notificationGuid);
  }
};

export default PosStoreNotificationService;
