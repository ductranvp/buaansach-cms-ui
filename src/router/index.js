import Vue from "vue";
import VueRouter from "vue-router";
import PublicRoutes from "@/router/public.routes";
import AdminRoutes from "@/router/private-routes/admin.routes";
import ManagerRoutes from "@/router/private-routes/manager.routes";
import UserRoutes from "@/router/private-routes/user.routes";
import Roles from "@/config/security/roles";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    /* Trang dành cho tất cả */
    ...PublicRoutes,
    /* Trang dành cho người dùng hệ thống nói chung */
    {
      path: "/",
      component: () => import("@/views/layout/user/UserLayout"),
      redirect: "/home",
      children: [...UserRoutes]
    },
    /* Trang dành cho quản trị hệ thống */
    {
      path: "/admin",
      component: () => import("@/views/layout/admin/AdminLayout"),
      redirect: "/admin/dashboard",
      children: [...AdminRoutes]
    },
    /* Trang quản lý dành cho đối tác */
    {
      path: "/management/:storeGuid",
      component: () => import("@/views/layout/manager/ManagerLayout"),
      children: [...ManagerRoutes]
    },
    /* Trang bán hàng */
    {
      path: "/:storeGuid/pos",
      name: "posPage",
      component: () => import("@/views/private/pos-machine/PosMachineLayout"),
      meta: {
        title: "private.pageTitle.posPage",
        roles: [Roles.USER]
      }
    },
    {
      path: "*",
      redirect: "/not-found",
    }
  ]
});

export default router;
