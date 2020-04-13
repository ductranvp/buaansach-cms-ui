const PublicRoutes = [
  {
    path: "/reset-password/init",
    name: "resetPasswordInitPage",
    component: () => import("@/views/public/reset-password/ResetPasswordInit"),
    meta: {
      title: "public.pageTitle.resetPasswordInitPage"
    }
  },
  {
    path: "/reset-password/finish/key=:key",
    name: "resetPasswordFinishPage",
    component: () => import("@/views/public/reset-password/ResetPasswordFinish"),
    meta: {
      title: "public.pageTitle.resetPasswordFinishPage"
    }
  },
  {
    path: "/login",
    name: "loginPage",
    component: () => import("@/views/public/login/Login"),
    meta: {
      title: "public.pageTitle.loginPage"
    }
  },
  {
    path: "/forbidden",
    name: "forbiddenPage",
    component: () => import("@/views/public/error-page/Page403"),
    meta: {
      title: "public.pageTitle.forbiddenPage"
    }
  },
  {
    path: "/not-found",
    name: "notFoundPage",
    component: () => import("@/views/public/error-page/Page404"),
    meta: {
      title: "public.pageTitle.notFoundPage"
    }
  }
];

export default PublicRoutes;
