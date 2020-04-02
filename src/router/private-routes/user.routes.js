import Roles from "@/config/security/roles";
import Profile from "@/views/private/user/profile/Profile";
import UserDashboard from "@/views/private/user/UserDashboard";

const UserRoutes = [
  {
    path: "dashboard",
    name: "userDashboardPage",
    component: UserDashboard,
    meta: {
      title: "private.pageTitle.user.userDashboardPage",
      roles: [Roles.USER]
    }
  }
];

export default UserRoutes;
