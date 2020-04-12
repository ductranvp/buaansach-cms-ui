import Roles from "@/config/security/roles";
import Home from "@/views/private/user/home/Home";
import Profile from "@/views/private/user/profile/Profile";

const UserRoutes = [
  {
    path: "home",
    name: "homePage",
    component: Home,
    meta: {
      title: "public.pageTitle.homePage",
      roles: [Roles.USER]
    }
  },
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

export default UserRoutes;
