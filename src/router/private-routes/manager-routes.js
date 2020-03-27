import ManagerDashboard from "@/views/private/manager/ManagerDashboard";
import Roles from "@/config/security/roles";

const ManagerRoutes = [
  {
    path: "dashboard",
    name: "managerDashboardPage",
    component: ManagerDashboard,
    meta: {
      title: "private.managerDashboardPage.pageTitle",
      roles: [Roles.MANAGER]
    }
  }
];

export default ManagerRoutes;
