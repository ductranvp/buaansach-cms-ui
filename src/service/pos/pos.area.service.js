import request from "@/config/request";

const baseUrl = "api/v1/pos/area";
const PosAreaService = {
  /**
   * @param {String} params - storeGuid
   * */
  getListAreaWithSeatByStoreGuid(params) {
    return request.get(baseUrl + "/list-with-seat-by-store/" + params);
  }
};

export default PosAreaService;
