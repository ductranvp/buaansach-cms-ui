import request from "@/config/request";

const baseUrl = "api/v1/employee/pos";
const EmployeePosService = {
  getListSeatByStoreGuid(params) {
    return request.get(baseUrl + "/list-seat-by-store/" + params);
  },

};

export default EmployeePosService;
