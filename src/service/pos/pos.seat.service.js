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
  }
};

export default PosSeatService;
