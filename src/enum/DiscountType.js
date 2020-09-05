const DiscountType = {
  values: {
    IN_STORE: "IN_STORE",
    TAKE_AWAY: "TAKE_AWAY",
    ONLINE: "ONLINE",
  },
  withLabel: [
    {label: "Tại quán", value: "IN_STORE"},
    {label: "Mang về", value: "TAKE_AWAY"},
    {label: "Online", value: "ONLINE"},
  ]
};

export default DiscountType;
