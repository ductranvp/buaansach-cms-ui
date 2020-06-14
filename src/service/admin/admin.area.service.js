import request from "@/config/request";

const baseUrl = "api/v1/admin/area";

const AdminAreaService = {
  createArea(payload) {
    return request.post(baseUrl + "/create", payload);
  },
  updateArea(payload) {
    return request.put(baseUrl + "/update", payload);
  },
  getListAreaByStoreGuid(storeGuid) {
    return request.get(baseUrl + "/list-by-store/" + storeGuid);
  },
  deleteArea(areaGuid) {
    return request.delete(baseUrl + "/delete/" + areaGuid);
  },
  toggleArea(payload) {
    return request.put(baseUrl + "/toggle-area", payload);
  },
};

export default AdminAreaService;
