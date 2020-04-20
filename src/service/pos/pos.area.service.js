import request from "@/config/request";

const baseUrl = "api/v1/pos/area";
const PosAreaService = {
  getListAreaWithSeatByStoreGuid(params) {
    return request.get(baseUrl + "/list-with-seat-by-store/" + params);
  },
  getListAreaWithoutSeatByStoreGuid(params) {
    return request.get(baseUrl + "/list-without-seat-by-store/" + params);
  },
};

export default PosAreaService;
