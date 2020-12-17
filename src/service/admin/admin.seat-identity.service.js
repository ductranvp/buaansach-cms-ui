import request from "@/config/request";

const baseUrl = "api/v1/admin/seat-identity";
const AdminSeatIdentityService = {
  updateAllSeatIdentity() {
    return request.put(baseUrl + "/update");
  }
};

export default AdminSeatIdentityService;
