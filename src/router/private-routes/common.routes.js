import Profile from "@/views/private/user/profile/Profile";
import Roles from "@/config/security/roles";

const CommonRoutes = [
  {
    path: "profile",
    name: "profilePage",
    component: Profile,
    meta: {
      title: "private.pageTitle.common.profilePage",
      roles: [Roles.USER]
    }
  }
];

export default CommonRoutes;
