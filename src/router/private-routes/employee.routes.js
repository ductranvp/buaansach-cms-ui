import Roles from "@/config/security/roles";

const EmployeeRoutes = [
  {
    path: "dashboard",
    name: "employeeDashboardPage",
    component: () => import("@/views/private/employee/EmployeeDashboard"),
    meta: {
      title: "private.posPage.pageTitle",
      roles: [Roles.USER]
    }
  }
];

export default EmployeeRoutes;
