import Vue from "vue";
import VueRouter from "vue-router";
import PublicRoutes from "@/router/public-routes";
import PublicLayout from "@/views/layout/public/PublicLayout";

Vue.use(VueRouter);
const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      component: PublicLayout,
      children: [...PublicRoutes]
    }
  ]
});

export default router;
