import Roles from "@/config/security/roles";

const ManagerRoutes = [
  {
    path: "dashboard",
    name: "managerDashboardPage",
    component: () => import("@/views/private/manager/ManagerDashboard"),
    meta: {
      title: "private.pageTitle.manager.managerDashboardPage",
      roles: [Roles.MANAGER]
    }
  },
  {
    path: "customer-voucher-code",
    name: "managerCustomerVoucherCodePage",
    component: () => import("@/views/private/manager/customer-voucher/ManagerCustomerVoucherCode"),
    meta: {
      title: "private.pageTitle.manager.managerCustomerVoucherCodePage",
      roles: [Roles.MANAGER]
    }
  }
];

export default ManagerRoutes;
