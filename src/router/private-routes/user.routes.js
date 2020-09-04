import Roles from "@/config/security/roles";
import Home from "@/views/private/user/home/Home";
import Profile from "@/views/private/user/profile/Profile";

const UserRoutes = [
  {
    path: "home",
    name: "homePage",
    component: () => import("@/views/private/user/home/Home"),
    meta: {
      title: "private.pageTitle.user.homePage",
      roles: [Roles.USER]
    }
  },
  {
    path: "profile",
    name: "profilePage",
    component: () => import("@/views/private/user/profile/Profile"),
    meta: {
      title: "private.pageTitle.user.profilePage",
      roles: [Roles.USER]
    }
  }
];

export default UserRoutes;
