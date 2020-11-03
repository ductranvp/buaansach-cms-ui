import DiscountType from "@/enum/DiscountType";

function getPayAmount(total, discount, discountType, pointValue) {
  let amount = total;
  if (discount) {
    amount = amount - getDiscountAmount(total, discount, discountType);
  }
  if (pointValue) amount = amount - pointValue;
  return Math.max(amount, 0);
}

function getDiscountAmount(total, discount, discountType) {
  let amount = 0;
  if (discount) {
    if (discountType === DiscountType.value.VALUE) {
      amount = discount;
    } else {
      amount = (Math.floor(total * discount / 100));
    }
  }
  return Math.max(amount, 0);
}

function getProductPrice(normalPrice, discount, discountType) {
  let amount = normalPrice;
  if (discount) {
    amount = amount - getDiscountAmount(normalPrice, discount, discountType);
  }
  return Math.max(amount, 0);
}

const PriceUtils = {
  getPayAmount: getPayAmount,
  getDiscountAmount: getDiscountAmount,
  getProductPrice: getProductPrice
};

export default PriceUtils;
