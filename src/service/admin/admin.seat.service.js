import request from "@/config/request";

const baseUrl = "api/v1/admin/seat";
const AdminSeatService = {
  createSeat(payload) {
    return request.post(baseUrl + "/create", payload );
  },
  updateSeat(payload) {
    return request.put(baseUrl + "/update", payload);
  },
  // getListSeatByAreaGuid(areaGuid) {
  //   return request.get(baseUrl + "/list-by-area/" + areaGuid);
  // },
  // getListSeatByStoreGuid(storeGuid) {
  //   return request.get(baseUrl + "/list-by-store/" + storeGuid);
  // },
  deleteSeat(seatGuid) {
    return request.delete(baseUrl + "/delete/" + seatGuid);
  }
};

export default AdminSeatService;
