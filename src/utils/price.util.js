function getPayAmount(total, discount, discountType) {
  let amount = total;
  if (discount) {
    amount = amount - getDiscountAmount(total, discount, discountType);
  }
  return amount > 0 ? amount : 0;
}

function getDiscountAmount(total, discount, discountType) {
  let amount = 0;
  if (discount) {
    if (discountType === "VALUE") {
      amount = discount;
    } else {
      amount = (Math.floor(total * discount / 100));
    }
  }
  return amount > 0 ? amount : 0;
}

const PriceUtils = {
  getPayAmount: getPayAmount,
  getDiscountAmount: getDiscountAmount
};

export default PriceUtils;
