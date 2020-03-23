import EmployeeDashboard from "@/views/private/employee/EmployeeDashboard";
import Roles from "@/config/security/roles";

const EmployeeRoutes = [
  {
    path: "dashboard",
    component: EmployeeDashboard,
    name: "EmployeeDashboardPage",
    meta: {
      roles: [Roles.EMPLOYEE]
    }
  }
];

export default EmployeeRoutes;
