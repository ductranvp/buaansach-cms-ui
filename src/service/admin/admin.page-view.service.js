import request from "@/config/request";

const baseUrl = "api/v1/admin/page-view";

const AdminPageViewService = {
  /**
   * @param {Date} payload.startDate
   * @param {Date} payload.endDate
   * */
  getPageViewStatistic(payload) {
    return request.post(baseUrl + "/statistic", payload);
  }
};

export default AdminPageViewService;
