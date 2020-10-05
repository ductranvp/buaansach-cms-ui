import request from "@/config/request";

const baseUrl = "api/v1/pos/sale-report";
const PosSaleReportService = {
  /**
   * Lấy báo cáo của user hiện tại
   * @param {String} params.storeGuid
   * @param {String} params.startDate
   * @param {String} params.endDate
   * */
  getCurrentUserSaleReport(params) {
    return request.post(baseUrl + "/current-user", params);
  },

  /**
   * Lấy báo cáo của user theo userLogin
   * @param {String} params.storeGuid
   * @param {String} params.userLogin
   * @param {String} params.startDate
   * @param {String} params.endDate
   * */
  getSaleReport(params) {
    return request.post(baseUrl + "/get-report", params);
  },
};

export default PosSaleReportService;
