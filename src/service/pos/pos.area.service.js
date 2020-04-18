import request from "@/config/request";

const baseUrl = "api/v1/pos/area";
const PosAreaService = {
  getListSeatByStoreGuid(params) {
    return request.get(baseUrl + "/list-by-store/" + params);
  },

};

export default PosAreaService;
