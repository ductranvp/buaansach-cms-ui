import request from "@/config/request";

const baseUrl = "api/v1/pos/product";
const PosProductService = {
  getStoreProduct(params) {
    return request.get(baseUrl + "/list");
  },

};

export default PosProductService;
