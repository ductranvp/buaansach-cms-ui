import request from "@/config/request";

const baseUrl = "api/v1/guest/product";
const GuestProductService = {
  getProduct() {
    return request.get(baseUrl + "/list");
  }

};

export default GuestProductService;
