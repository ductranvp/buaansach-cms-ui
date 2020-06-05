const orderStatus = {
  CREATED: "CREATED",
  RECEIVED: "RECEIVED",
  PURCHASED: "PURCHASED",
  CANCELLED_BY_EMPLOYEE: "CANCELLED_BY_EMPLOYEE",
  CANCELLED_BY_CUSTOMER: "CANCELLED_BY_CUSTOMER",
  CANCELLED_BY_SYSTEM: "CANCELLED_BY_SYSTEM",
};

const orderType = {
  IN_STORE: "IN_STORE",
  TAKE_AWAY: "TAKE_AWAY",
  ONLINE: "ONLINE",
  TEST: "TEST",
};

const orderProductStatus = {
  CREATED: "CREATED",
  PREPARING: "PREPARING",
  SERVED: "SERVED",
  CANCELLED_BY_EMPLOYEE: "CANCELLED_BY_EMPLOYEE",
  CANCELLED_BY_CUSTOMER: "CANCELLED_BY_CUSTOMER",
  CANCELLED_BY_SYSTEM: "CANCELLED_BY_SYSTEM",
};

const paymentMethods = [
  {label: "Tiền mặt", value: "CASH"},
  {label: "Thẻ tín dụng", value: "CREDIT_CARD"},
  {label: "Ví MoMo", value: "MOMO_APP"},
  {label: "Zalo Pay", value: "ZALO_PAY"},
  {label: "Viettel Pay", value: "VIETTEL_PAY"},
  {label: "VN Pay", value: "VN_PAY"},
];


function storeProductToOrderProduct(state, storeProduct) {
  return {
    guid: null,
    orderGuid: null,
    productGuid: storeProduct.productGuid,
    orderProductGroup: null,
    orderProductQuantity: null,
    orderProductPrice: storeProduct.productPrice,
    orderProductNote: null,
    orderProductStatus: state.orderProductStatus.PREPARING,
    orderProductStatusTimeline: null,
    orderProductCancelReason: null,
    orderProductDiscount: storeProduct.productDiscount,
    orderProductSaleGuid: storeProduct.productSaleGuid,
    orderProductVoucherCode: null,

    productCode: storeProduct.productCode,
    productName: storeProduct.productName,
    productUnit: storeProduct.productUnit,
    productImageUrl: storeProduct.productImageUrl,
  };
}

const PosOrderStoreUtil = {
  orderStatus: orderStatus,
  orderType: orderType,
  orderProductStatus: orderProductStatus,
  paymentMethods: paymentMethods,
  storeProductToOrderProduct: storeProductToOrderProduct
};
export default PosOrderStoreUtil;
