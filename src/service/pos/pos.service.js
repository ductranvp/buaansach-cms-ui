import request from "@/config/request";

const baseUrl = "api/v1/pos";
const PosService = {
  getListSeatByStoreGuid(params) {
    return request.get(baseUrl + "/list-seat-by-store/" + params);
  },

};

export default PosService;
