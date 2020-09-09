import request from '@/config/request';

const baseUrl = 'api/v1/admin/store-sale';

const AdminStoreSaleService = {
  /**
   * @param {Array<{storeSaleActivated: Boolean, storeGuid: String, saleGuid: String}>} payload
   * */
  addStoreSale(payload) {
    return request.post(baseUrl + '/add', payload);
  },

  /**
   * @param {String} params - saleGuid
   * */
  getListStoreSaleBySale(params) {
    return request.get(baseUrl + '/list-by-sale/' + params);
  },

  /**
   * @param {{guid: String, storeSaleActivated: Boolean, storeGuid: String, saleGuid: String}} payload
   * */
  updateStoreSale(payload) {
    return request.put(baseUrl + '/update', payload);
  },

  /**
   * @param {String} params - storeSaleGuid
   * */
  deleteStoreSale(params) {
    return request.delete(baseUrl + '/delete/' + params);
  },

  /**
   * @param {{storeGuid: String, saleGuid: String}} payload
   * */
  makePrimary(payload) {
    return request.put(baseUrl + '/make-primary', payload);
  },
};

export default AdminStoreSaleService;
