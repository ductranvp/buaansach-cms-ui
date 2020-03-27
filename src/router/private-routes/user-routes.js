import Roles from "@/config/security/roles";
import Profile from "@/views/private/user/profile/Profile";

const UserRoutes = [
  {
    path: "profile",
    component: Profile,
    name: "ProfilePage",
    meta: {
      roles: [Roles.USER]
    }
  }
];

export default UserRoutes;
