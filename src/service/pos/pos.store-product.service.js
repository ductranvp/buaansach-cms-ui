import request from "@/config/request";

const baseUrl = "api/v1/pos/store-product";
const PosStoreProductService = {
  getListProductByStoreGuid(params) {
    return request.get(baseUrl + "/list-by-store/" + params);
  },

};

export default PosStoreProductService;
