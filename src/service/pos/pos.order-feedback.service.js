import request from "@/config/request";

const baseUrl = "api/v1/pos/order-feedback";
const PosOrderFeedbackService = {
  sendFeedback(payload) {
    return request.post(baseUrl + "/send-feedback", payload);
  },
  getFeedback(params) {
    return request.get(baseUrl + "/get-feedback/" + params);
  }
};

export default PosOrderFeedbackService;
