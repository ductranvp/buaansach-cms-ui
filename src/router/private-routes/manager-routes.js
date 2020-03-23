import ManagerDashboard from "@/views/private/manager/ManagerDashboard";
import Roles from "@/config/security/roles";

const ManagerRoutes = [
  {
    path: "dashboard",
    component: ManagerDashboard,
    name: "ManagerDashboardPage",
    meta: {
      title: "Manager",
      roles: [Roles.MANAGER]
    }
  }
];

export default ManagerRoutes;
