import request from "@/config/request";

const baseUrl = "api/v1/pos/sale-report";
const PosSaleReportService = {
  getCurrentUserSaleReport(params) {
    return request.post(baseUrl + "/current-user", params);
  },
  getSaleReport(params) {
    return request.post(baseUrl + "/get-report", params);
  },
};

export default PosSaleReportService;
