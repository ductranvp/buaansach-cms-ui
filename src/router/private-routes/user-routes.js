import Roles from "@/config/security/roles";
import Profile from "@/views/private/user/profile/Profile";

const UserRoutes = [
  {
    path: "profile",
    name: "profilePage",
    component: Profile,
    meta: {
      title: "private.profilePage.pageTitle",
      roles: [Roles.USER]
    }
  }
];

export default UserRoutes;
