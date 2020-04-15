import request from "@/config/request";

const baseUrl = "api/v1/store-user";
const StoreUserService = {
  getListStoreUserByUser() {
    return request.get(baseUrl + "/list-by-user");
  },

};

export default StoreUserService;
