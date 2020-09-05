const ProductStatus = {
  values: {
    AVAILABLE: "AVAILABLE",
    UNAVAILABLE: "UNAVAILABLE",
    STOP_TRADING: "STOP_TRADING",
  },
  withLabel: [
    {label: "Có sẵn", value: "AVAILABLE"},
    {label: "Tạm hết hàng", value: "UNAVAILABLE"},
    {label: "Ngừng kinh doanh", value: "STOP_TRADING"}
  ],
};

export default ProductStatus;
