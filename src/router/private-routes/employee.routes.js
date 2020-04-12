import EmployeeDashboard from "@/views/private/employee/EmployeeDashboard";
import Roles from "@/config/security/roles";

const EmployeeRoutes = [
  {
    path: "dashboard",
    name: "employeeDashboardPage",
    component: EmployeeDashboard,
    meta: {
      title: "private.posPage.pageTitle",
      roles: [Roles.USER]
    }
  }
];

export default EmployeeRoutes;
