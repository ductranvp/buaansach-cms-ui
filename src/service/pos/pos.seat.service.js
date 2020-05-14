import request from "@/config/request";

const baseUrl = "api/v1/pos/seat";
const PosSeatService = {
  getListSeatByStoreGuid(params) {
    return request.get(baseUrl + "/list-by-store/" + params);
  },
  getSeat(params){
    return request.get(baseUrl + "/get/" + params);
  },
  toggleLock(params){
    return request.put(baseUrl + "/toggle-lock/" + params);
  }
};

export default PosSeatService;
