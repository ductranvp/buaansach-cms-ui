const StoreProductStatus = {
  valueArray: ["AVAILABLE", "UNAVAILABLE", "STOP_TRADING"],
  labelArray: ["Còn hàng", "Tạm hết hàng", "Ngừng kinh doanh"],
  value: {AVAILABLE: "AVAILABLE", UNAVAILABLE: "UNAVAILABLE", STOP_TRADING: "STOP_TRADING"},
  label: {AVAILABLE: "Còn hàng", UNAVAILABLE: "Tạm hết hàng", STOP_TRADING: "Ngừng kinh doanh"},
  optionArray: [
    {value: "AVAILABLE", label: "Còn hàng"},
    {value: "UNAVAILABLE", label: "Tạm hết hàng"},
    {value: "STOP_TRADING", label: "Ngừng kinh doanh"}
  ],
};
export default StoreProductStatus;
