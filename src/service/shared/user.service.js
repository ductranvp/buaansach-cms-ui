import request from "@/config/request";
import CoreService from "@/service/shared/core.service";

const baseUrl = "api/v1/user";
const UserService = {
  /**
   * Đăng nhập
   * @param {String} payload.principal - Tên đăng nhập, email hoặc phone
   * @param {String} payload.password - Mật khẩu
   * @param {Boolean} payload.rememberMe - Ghi nhớ
   * */
  authenticate(payload) {
    return request.post(baseUrl + "/authenticate", payload);
  },

  /**
   * Lấy thông tin user hiện tại
   * */
  getUserInfo() {
    return request.get(baseUrl + "/info");
  },

  /**
   * Cập nhật thông tin user
   * @param {Object} payload
   * @param {String} payload.userEmail
   * @param {String} payload.userPhone
   * @param {String} payload.fullName
   * @param {String} payload.userGender
   * @param {Date} payload.userBirthday
   * @param {String} payload.userAddress
   * @param {String} payload.langKey
   * @param {Image} image
   * */
  updateUser(payload, image) {
    const formData = CoreService.processFormDataWithImage(payload, image);
    return request.put(baseUrl + "/update", formData, CoreService.formDataConfig);
  },

  /**
   * Đổi mật khẩu
   * @param {Object} payload
   * @param {String} payload.currentPassword
   * @param {String} payload.newPassword
   * */
  changePassword(payload) {
    return request.post(baseUrl + "/change-password", payload);
  },

  /**
   * @param {String} payload.email
   * @param {String} payload.domainType
   * */
  resetPasswordInit(payload) {
    return request.post(baseUrl + "/reset-password/init", payload);
  },

  /**
   * @param {Object} payload
   * @param {String} payload.key
   * @param {String} payload.newPassword
   * */
  resetPasswordFinish(payload) {
    return request.post(baseUrl + "/reset-password/finish", payload);
  }
};

export default UserService;
