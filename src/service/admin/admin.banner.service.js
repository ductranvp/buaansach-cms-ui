import request from "@/config/request";
import CoreService from "@/service/shared/core.service";

const baseUrl = "api/v1/admin/banner";

const AdminBannerService = {
  /**
   * @param {Object} payload
   * @param {String} payload.bannerType
   * @param {Boolean} payload.bannerActivated
   * @param {Image} image
   * */
  createBanner(payload, image) {
    const formData = CoreService.processFormDataWithImage(payload, image);
    return request.post(baseUrl + "/create", formData, CoreService.formDataConfig);
  },

  /**
   * @param {Object} payload
   * @param {String} payload.bannerType
   * @param {Number} payload.bannerOrder
   * @param {Boolean} payload.bannerActivated
   * @param {Image} image
   * */
  updateBanner(payload, image) {
    const formData = CoreService.processFormDataWithImage(payload, image);
    return request.put(baseUrl + "/update", formData, CoreService.formDataConfig);
  },
  getAllBanner() {
    return request.get(baseUrl + "/list");
  },
  deleteBanner(bannerGuid) {
    return request.delete(baseUrl + "/delete/" + bannerGuid);
  },
};

export default AdminBannerService;
