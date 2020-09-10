import request from '@/config/request';

const baseUrl = 'api/v1/admin/sale';

const AdminSaleService = {
  createSale(payload) {
    return request.post(baseUrl + '/create', payload);
  },
  getSale(params) {
    return request.get(baseUrl + '/get/' + params);
  },
  getListSale() {
    return request.get(baseUrl + '/list');
  },
  getListStoreSale(storeGuid) {
    return request.get(baseUrl + '/list-by-store/' + storeGuid);
  },
  updateSale(payload) {
    return request.put(baseUrl + '/update', payload);
  },
  deleteSale(params) {
    return request.delete(baseUrl + '/delete/' + params);
  }
};

export default AdminSaleService;
