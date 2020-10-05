import request from '@/config/request';

const baseUrl = 'api/v1/pos/sale';

const PosSaleService = {
  /**
   * @param {String} params - storeGuid
   * */
  getListStoreSale(params) {
    return request.get(baseUrl + '/list-by-store/' + params);
  },

  /**
   * @param {String} payload.saleGuid
   * @param {String} payload.orderGuid
   * */
  applySale(payload) {
    return request.put(baseUrl + '/apply', payload);
  },

  /**
   * @param {String} payload - orderGuid
   * */
  cancelSale(payload) {
    return request.put(baseUrl + '/cancel', payload);
  }
};

export default PosSaleService;
