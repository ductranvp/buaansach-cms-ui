import EmployeeDashboard from "@/views/private/employee/EmployeeDashboard";
import Roles from "@/config/security/roles";

const EmployeeRoutes = [
  {
    path: "dashboard",
    name: "employeeDashboardPage",
    component: EmployeeDashboard,
    meta: {
      title: "private.employeeDashboardPage.pageTitle",
      roles: [Roles.EMPLOYEE]
    }
  }
];

export default EmployeeRoutes;
