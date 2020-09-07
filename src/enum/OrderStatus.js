const OrderStatus = {
  valueArray: ["CREATED", "RECEIVED", "PURCHASED", "CANCELLED"],
  labelArray: ["Đã tạo", "Đã tiếp nhận", "Đã thanh toán", "Đã hủy"],
  value: {CREATED: "CREATED", RECEIVED: "RECEIVED", PURCHASED: "PURCHASED", CANCELLED: "CANCELLED"},
  label: {CREATED: "Đã tạo", RECEIVED: "Đã tiếp nhận", PURCHASED: "Đã thanh toán", CANCELLED: "Đã hủy"},
  optionArray: [
    {value: "CREATED", label: "Đã tạo"},
    {value: "RECEIVED", label: "Đã tiếp nhận"},
    {value: "PURCHASED", label: "Đã thanh toán"},
    {value: "CANCELLED", label: "Đã hủy"}
  ],
};
export default OrderStatus;
