import Roles from "@/config/security/roles";

const ManagerRoutes = [
  {
    path: "dashboard",
    name: "managerDashboardPage",
    component: () => import("@/views/private/manager/ManagerDashboard"),
    meta: {
      title: "private.managerDashboardPage.pageTitle",
      roles: [Roles.USER]
    }
  }
];

export default ManagerRoutes;
