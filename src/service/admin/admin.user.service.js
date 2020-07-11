import request from "@/config/request";

const baseUrl = "api/v1/admin/user";

const AdminUserService = {
  createUser(payload) {
    return request.post(baseUrl + "/create", payload);
  },
  updateUser(payload) {
    return request.put(baseUrl + "/update", payload);
  },
  getPageUser(params) {
    return request.get(baseUrl + "/list", {
      params: params
    });
  },
  changePassword(payload) {
    return request.put(baseUrl + "/change-password", payload);
  },
  toggleActivation(userLogin) {
    return request.put(baseUrl + "/toggle-activation", userLogin);
  }
};

export default AdminUserService;
