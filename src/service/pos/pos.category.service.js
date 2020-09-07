import request from "@/config/request";

const baseUrl = "api/v1/pos/category";
const PosCategoryService = {
  /**
   * @param {String} params - storeGuid
   * */
  getListPosCategoryDTO(params) {
    return request.get(baseUrl + "/list-by-store/" + params);
  },
};

export default PosCategoryService;
