import OrderProductStatus from "@/enum/OrderProductStatus";

function storeProductToOrderProduct(state, storeProduct) {
  return {
    guid: null,
    orderProductGroup: null,
    orderProductQuantity: null,
    orderProductNote: null,
    orderProductStatus: OrderProductStatus.value.PREPARING,
    orderProductStatusTimeline: null,
    orderProductCancelReason: null,
    orderProductPrice: storeProduct.productPrice,
    orderProductDiscount: storeProduct.productDiscount,
    orderProductDiscountType: storeProduct.productDiscountType,

    orderGuid: null,
    productGuid: storeProduct.productGuid,
    saleGuid: storeProduct.saleGuid,

    productCode: storeProduct.productCode,
    productName: storeProduct.productName,
    productUnit: storeProduct.productUnit,
    productImageUrl: storeProduct.productImageUrl,
    productThumbnailUrl: storeProduct.productThumbnailUrl,
  };
}

const PosOrderStoreUtil = {
  storeProductToOrderProduct: storeProductToOrderProduct
};
export default PosOrderStoreUtil;
