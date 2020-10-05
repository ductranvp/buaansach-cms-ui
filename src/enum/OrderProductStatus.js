const OrderProductStatus = {
  valueArray: ["CREATED", "PREPARING", "SERVED", "CANCELLED"],
  labelArray: ["Đã gọi", "Đang chuẩn bị", "Đã phục vụ", "Đã hủy"],
  value: {CREATED: "CREATED", PREPARING: "PREPARING", SERVED: "SERVED", CANCELLED: "CANCELLED"},
  label: {CREATED: "Đã gọi", PREPARING: "Đang chuẩn bị", SERVED: "Đã phục vụ", CANCELLED: "Đã hủy"},
  optionArray: [
    {value: "CREATED", label: "Đã gọi"},
    {value: "PREPARING", label: "Đang chuẩn bị"},
    {value: "SERVED", label: "Đã phục vụ"},
    {value: "CANCELLED", label: "Đã hủy"}
  ],
};
export default OrderProductStatus;
