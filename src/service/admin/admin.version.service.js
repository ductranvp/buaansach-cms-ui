import request from '@/config/request';

const baseUrl = 'api/v1/admin/version';

const AdminVersionService = {
  /**
   * @param {String} payload.versionName
   * @param {String} payload.versionDescription
   * @param {String} payload.versionType
   * @param {String} payload.versionNumber
   * */
  createVersion(payload) {
    return request.post(baseUrl + '/create', payload);
  },
  getAllVersion() {
    return request.get(baseUrl + '/list');
  },
  getLatestVersion(versionType) {
    return request.get(baseUrl + '/latest/' + versionType);
  },
  updateVersion(payload) {
    return request.put(baseUrl + '/update', payload);
  },
  deleteVersion(versionGuid) {
    return request.delete(baseUrl + '/delete/' + versionGuid);
  },
};

export default AdminVersionService;
