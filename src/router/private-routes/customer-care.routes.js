import Roles from "@/config/security/roles";

const CustomerCareRoutes = [
  {
    path: "dashboard",
    name: "customerCareDashboardPage",
    component: () => import("@/views/private/customer-care/CustomerCareDashboard"),
    meta: {
      title: "private.pageTitle.customerCare.customerCareDashboardPage",
      roles: [Roles.CUSTOMER_CARE]
    }
  },
  {
    path: "customer-voucher-code",
    name: "customerCareCustomerVoucherCodePage",
    component: () => import("@/views/private/customer-care/customer-voucher/CustomerVoucherCode"),
    meta: {
      title: "private.pageTitle.customerCare.customerCareCustomerVoucherCodePage",
      roles: [Roles.CUSTOMER_CARE]
    }
  },
  {
    path: "customer-order-purchased",
    name: "customerCareCustomerOrderPurchasedPage",
    component: () => import("@/views/private/customer-care/customer-order/CustomerOrder"),
    meta: {
      title: "private.pageTitle.customerCare.customerCareCustomerOrderPurchasedPage",
      roles: [Roles.CUSTOMER_CARE]
    }
  }
];

export default CustomerCareRoutes;
