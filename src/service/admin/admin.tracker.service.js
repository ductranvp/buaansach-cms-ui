import request from "@/config/request";

const baseUrl = "api/v1/admin/tracker";

const AdminTrackerService = {
  getActiveUsers() {
    return request.get(baseUrl + "/active-users");
  },
};

export default AdminTrackerService;
