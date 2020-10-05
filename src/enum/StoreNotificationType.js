const StoreNotificationType = {
  valueArray: ["ORDER_UPDATE", "PAY_REQUEST", "CALL_WAITER"],
  labelArray: ["Thông báo gọi món", "Thông báo thanh toán", "Thông báo gọi nhân viên"],
  value: {ORDER_UPDATE: "ORDER_UPDATE", PAY_REQUEST: "PAY_REQUEST", CALL_WAITER: "CALL_WAITER"},
  label: {
    ORDER_UPDATE: "Thông báo gọi món",
    PAY_REQUEST: "Thông báo thanh toán",
    CALL_WAITER: "Thông báo gọi nhân viên"
  },
  optionArray: [
    {value: "ORDER_UPDATE", label: "Thông báo gọi món"},
    {value: "PAY_REQUEST", label: "Thông báo thanh toán"},
    {value: "CALL_WAITER", label: "Thông báo gọi nhân viên"}
  ],
};
export default StoreNotificationType;
