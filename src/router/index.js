import Vue from "vue";
import VueRouter from "vue-router";
import PublicRoutes from "@/router/public.routes";
import AdminRoutes from "@/router/private-routes/admin.routes";
import PartnerRoutes from "@/router/private-routes/partner.routes";
import UserRoutes from "@/router/private-routes/user.routes";
import Roles from "@/config/security/roles";
import PosStoreService from "@/service/pos/pos.store.service";
import CustomerCareRoutes from "@/router/private-routes/customer-care.routes";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    /* For all user include guest */
    ...PublicRoutes,
    /* For all system user */
    {
      path: "/",
      component: () => import("@/views/layout/user/UserLayout"),
      redirect: "/home",
      children: [...UserRoutes]
    },
    /* For admin to manage all system */
    {
      path: "/admin",
      component: () => import("@/views/layout/admin/AdminLayout"),
      redirect: "/admin/dashboard",
      children: [...AdminRoutes]
    },
    {
      path: "/customer-care",
      component: () => import("@/views/layout/customer-care/CustomerCareLayout"),
      redirect: "/customer-care/customer-voucher-code",
      children: [...CustomerCareRoutes]
    },
    /* For partner to manage stores */
    {
      path: "/management/:storeGuid",
      component: () => import("@/views/layout/partner/PartnerLayout"),
      children: [...PartnerRoutes]
    },
    /* For pos machine */
    {
      path: "/pos/:storeGuid",
      name: "posPage",
      component: () => import("@/views/layout/pos-machine/PosMachineLayout"),
      beforeEnter: async (to, from, next) => {
        try {
          const {data} = await PosStoreService.checkAccessibility(to.params.storeGuid);
          if (!data) await router.push({name: "forbiddenPage"});
          next();
        } catch (error) {
          await router.push({name: "homePage"});
        }
      },
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
