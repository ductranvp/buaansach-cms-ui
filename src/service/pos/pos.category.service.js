import request from "@/config/request";

const baseUrl = "api/v1/pos/category";
const PosCategoryService = {
  getListPosCategoryDTO() {
    return request.get(baseUrl + "/list");
  },
};

export default PosCategoryService;
