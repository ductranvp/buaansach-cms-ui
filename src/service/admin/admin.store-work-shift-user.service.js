import request from "@/config/request";

const baseUrl = "api/v1/admin/store-work-shift-user";

const AdminStoreWorkShiftUserService = {
  /**
   * @param {String} payload.storeWorkShiftGuid
   * @param {Array<String>} payload.listUserGuid
   * @param {Array<String>} payload.listWorkDay
   * */
  updateStoreWorkShiftUser(payload) {
    return request.put(baseUrl + "/update", payload);
  },
};

export default AdminStoreWorkShiftUserService;
