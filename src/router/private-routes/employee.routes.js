import PosPage from "@/views/private/employee/PosPage";
import Roles from "@/config/security/roles";

const EmployeeRoutes = [
  {
    path: "pos",
    name: "posPage",
    component: PosPage,
    meta: {
      title: "private.posPage.pageTitle",
      roles: [Roles.USER]
    }
  }
];

export default EmployeeRoutes;
