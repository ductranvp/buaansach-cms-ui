import request from "@/config/request";

const baseUrl = "/api/v1/guest/order";
const GuestOrderService = {
  getSeat(seatGuid) {
    return request.get(baseUrl + "/seat/" + seatGuid);
  },
  getAccountInfo() {
    return request.get(baseUrl + "/info");
  }
};

export default GuestOrderService;
