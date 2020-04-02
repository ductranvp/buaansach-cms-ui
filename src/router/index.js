import Vue from "vue";
import VueRouter from "vue-router";
import PublicRoutes from "@/router/public.routes";
import PublicLayout from "@/views/layout/public/PublicLayout";
import AdminLayout from "@/views/layout/admin/AdminLayout";
import AdminRoutes from "@/router/private-routes/admin.routes";
import UserRoutes from "@/router/private-routes/user.routes";
import UserLayout from "@/views/layout/user/UserLayout";
import CommonRoutes from "@/router/private-routes/common.routes";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      component: PublicLayout,
      redirect: "/home",
      children: [...PublicRoutes, ...CommonRoutes]
    },
    {
      path: "/admin",
      component: AdminLayout,
      redirect: "/admin/dashboard",
      children: [...AdminRoutes]
    },
    {
      path: "/user",
      component: UserLayout,
      redirect: "/user/dashboard",
      children: [...UserRoutes]
    }
  ]
});

export default router;
