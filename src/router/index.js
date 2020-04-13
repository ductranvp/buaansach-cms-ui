import Vue from "vue";
import VueRouter from "vue-router";
import PublicRoutes from "@/router/public.routes";
import AdminRoutes from "@/router/private-routes/admin.routes";
import ManagerRoutes from "@/router/private-routes/manager.routes";
import EmployeeRoutes from "@/router/private-routes/employee.routes";
import UserRoutes from "@/router/private-routes/user.routes";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    ...PublicRoutes,
    {
      path: "/",
      component: () => import("@/views/layout/user/UserLayout"),
      redirect: "/home",
      children: [...UserRoutes]
    },
    {
      path: "/admin",
      component: () => import("@/views/layout/admin/AdminLayout"),
      redirect: "/admin/dashboard",
      children: [...AdminRoutes]
    },
    {
      path: "/management/:storeGuid",
      component: () => import("@/views/layout/manager/ManagerLayout"),
      children: [...ManagerRoutes]
    },
    {
      path: "/store/:storeGuid",
      component: () => import("@/views/layout/employee/EmployeeLayout"),
      children: [...EmployeeRoutes]
    },
    {
      path: "*",
      redirect: "/not-found",
    }
  ]
});

export default router;
