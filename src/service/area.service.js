import request from "@/config/request";

const baseUrl = "api/area";
const AreaService = {
  createArea(payload) {
    return request.post(baseUrl + "/create", payload );
  },
  updateArea(payload) {
    return request.put(baseUrl + "/update", payload);
  },
  getListByStore(storeGuid) {
    return request.get(baseUrl + "/list" + storeGuid);
  },
  deleteArea(areaGuid) {
    return request.delete(baseUrl + "/delete/" + areaGuid);
  }
};

export default AreaService;
