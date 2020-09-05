const Authority = {
  values: {
    ROLE_ADMIN: "ROLE_ADMIN",
    ROLE_MODERATOR: "ROLE_MODERATOR",
    ROLE_PARTNER: "ROLE_PARTNER",
    ROLE_CUSTOMER_CARE: "ROLE_CUSTOMER_CARE",
    ROLE_INTERNAL_USER: "ROLE_INTERNAL_USER",
    ROLE_CUSTOMER_USER: "ROLE_CUSTOMER_USER",
  },
  withLabel: [
    {label: "Quản trị viên", value: "ROLE_ADMIN"},
    {label: "Quản lý", value: "ROLE_MODERATOR"},
    {label: "Đối tác", value: "ROLE_PARTNER"},
    {label: "CSKH", value: "ROLE_CUSTOMER_CARE"},
    {label: "Nhân viên", value: "ROLE_INTERNAL_USER"},
    {label: "Khách hàng", value: "ROLE_CUSTOMER_USER"},
  ]
};

export default Authority;
