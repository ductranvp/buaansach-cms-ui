import request from "@/config/request";

const baseUrl = "api/v1/pos/order-feedback";
const PosOrderFeedbackService = {
  /**
   * Gửi phản hồi
   * @param {String} payload.storeGuid
   * @param {String} payload.orderGuid
   * @param {String} payload.orderFeedbackAction
   * @param {Number} payload.serviceQualityRating
   * @param {Number} payload.productQualityRating
   * @param {String} payload.orderFeedbackContent
   * */
  sendFeedback(payload) {
    return request.post(baseUrl + "/send-feedback", payload);
  },

  /**
   * Gửi phản hồi
   * @param {String} params - orderGuid
   * */
  getFeedback(params) {
    return request.get(baseUrl + "/get-feedback/" + params);
  }
};

export default PosOrderFeedbackService;
