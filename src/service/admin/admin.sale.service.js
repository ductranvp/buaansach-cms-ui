import request from '@/config/request';
import CoreService from '@/service/shared/core.service';

const baseUrl = 'api/v1/admin/sale';

const AdminSaleService = {
  createSale(payload, image) {
    const formData = CoreService.processFormDataWithImage(payload, image);
    return request.post(baseUrl + '/create', formData, CoreService.formDataConfig);
  },
  getSale(params) {
    return request.get(baseUrl + '/get/' + params);
  },
  getListSale() {
    return request.get(baseUrl + '/list');
  },
  getListSaleByStore(storeGuid) {
    return request.get(baseUrl + '/list-by-store/' + storeGuid);
  },
  updateSale(payload, image) {
    const formData = CoreService.processFormDataWithImage(payload, image);
    return request.put(baseUrl + "/update", formData, CoreService.formDataConfig);
  },
  deleteSale(params) {
    return request.delete(baseUrl + '/delete/' + params);
  }
};

export default AdminSaleService;
