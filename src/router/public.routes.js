import Page403 from "@/views/public/error-page/Page403";
import Page404 from "@/views/public/error-page/Page404";
import Login from "@/views/public/login/Login";
import ResetPasswordFinish from "@/views/public/reset-password/ResetPasswordFinish";
import ResetPasswordInit from "@/views/public/reset-password/ResetPasswordInit";

const PublicRoutes = [
  {
    path: "/reset-password/init",
    name: "resetPasswordInitPage",
    component: ResetPasswordInit,
    meta: {
      title: "public.pageTitle.resetPasswordInitPage"
    }
  },
  {
    path: "/reset-password/finish/key=:key?",
    name: "resetPasswordFinishPage",
    component: ResetPasswordFinish,
    meta: {
      title: "public.pageTitle.resetPasswordFinishPage"
    }
  },
  {
    path: "/login",
    name: "loginPage",
    component: Login,
    meta: {
      title: "public.pageTitle.loginPage"
    }
  },
  {
    path: "/forbidden",
    name: "forbiddenPage",
    component: Page403,
    meta: {
      title: "public.pageTitle.forbiddenPage"
    }
  },
  {
    path: "/not-found",
    name: "notFoundPage",
    component: Page404,
    meta: {
      title: "public.pageTitle.notFoundPage"
    }
  }
];

export default PublicRoutes;
