import request from "@/config/request";

const baseUrl = "api/v1/pos/seat";
const PosSeatService = {
  /**
   * Lấy thông tin chỗ ngồi
   * @param {String} params - seatGuid
   * */
  getSeat(params) {
    return request.get(baseUrl + "/get/" + params);
  },

  /**
   * Khóa/Mở chỗ ngồi
   * @param {String} params - seatGuid
   * */
  toggleLock(params) {
    return request.put(baseUrl + "/toggle-lock/" + params);
  },

  /**
   * Khóa/Mở list chỗ ngồi
   * @param {Array<String>} payload.listSeatGuid
   * @param {Boolean} payload.locked
   * */
  toggleLockList(payload) {
    return request.put(baseUrl + "/toggle-lock-list", payload);
  }
};

export default PosSeatService;
