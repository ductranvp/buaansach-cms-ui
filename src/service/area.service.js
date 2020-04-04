import request from "@/config/request";

const baseUrl = "api/v1/area";
const AreaService = {
  createArea(payload) {
    return request.post(baseUrl + "/create", payload );
  },
  updateArea(payload) {
    return request.put(baseUrl + "/update", payload);
  },
  getListAreaByStore(storeGuid) {
    return request.get(baseUrl + "/list/" + storeGuid);
  },
  deleteArea(areaGuid) {
    return request.delete(baseUrl + "/delete/" + areaGuid);
  }
};

export default AreaService;
