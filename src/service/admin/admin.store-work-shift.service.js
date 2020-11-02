import request from "@/config/request";

const baseUrl = "api/v1/admin/store-work-shift";

const AdminStoreWorkShiftService = {
  /**
   * @param {String} payload.guid
   * @param {String} payload.storeWorkShiftName
   * @param {String} payload.storeWorkShiftDescription
   * @param {String} payload.storeWorkShiftStart
   * @param {String} payload.storeWorkShiftEnd
   * @param {String} payload.storeGuid
   * */
  createStoreWorkShift(payload) {
    return request.post(baseUrl + "/create", payload);
  },

  /**
   * @param {String} payload.guid
   * @param {String} payload.storeWorkShiftName
   * @param {String} payload.storeWorkShiftDescription
   * @param {String} payload.storeWorkShiftStart
   * @param {String} payload.storeWorkShiftEnd
   * @param {String} payload.storeGuid
   * */
  updateStoreWorkShift(payload) {
    return request.put(baseUrl + "/update", payload);
  },
  getListStoreWorkShiftByStore(storeGuid) {
    return request.get(baseUrl + "/list-by-store/" + storeGuid);
  },
  deleteStoreWorkShift(storeWorkShiftGuid) {
    return request.delete(baseUrl + "/delete/" + storeWorkShiftGuid);
  }
};

export default AdminStoreWorkShiftService;
