import Vue from "vue";
import VueRouter from "vue-router";
import PublicRoutes from "@/router/public-routes";
import PublicLayout from "@/views/layout/public/PublicLayout";
import AdminLayout from "@/views/layout/admin/AdminLayout";
import EmployeeLayout from "@/views/layout/employee/EmployeeLayout";
import ManagerLayout from "@/views/layout/manager/ManagerLayout";
import AdminRoutes from "@/router/private-routes/admin-routes";
import ManagerRoutes from "@/router/private-routes/manager-routes";
import EmployeeRoutes from "@/router/private-routes/employee-routes";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      component: PublicLayout,
      children: [...PublicRoutes]
    },
    {
      path: "/admin",
      component: AdminLayout,
      redirect: "/admin/dashboard",
      children: [...AdminRoutes]
    },
    {
      path: "/manager",
      component: ManagerLayout,
      redirect: "/manager/dashboard",
      children: [...ManagerRoutes]
    },
    {
      path: "/employee",
      component: EmployeeLayout,
      redirect: "/employee/dashboard",
      children: [...EmployeeRoutes]
    }
  ]
});

export default router;
