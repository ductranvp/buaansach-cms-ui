import request from "@/config/request";

const baseUrl = "api/v1/employee/store-user";
const EmployeeStoreUserService = {
  getListStoreUserByUser() {
    return request.get(baseUrl + "/list-by-user");
  },

};

export default EmployeeStoreUserService;
