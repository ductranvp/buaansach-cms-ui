import Login from "@/views/public/login/Login";
import Home from "@/views/public/home/Home";
import Page403 from "@/views/public/error-page/Page403";
import Page404 from "@/views/public/error-page/Page404";
import About from "@/views/public/about/About";
import Sale from "@/views/public/sale/Sale";
import Product from "@/views/public/product/Product";
import Order from "@/views/public/order/Order";
import ResetPasswordInit from "@/views/public/reset-password/ResetPasswordInit";
import Contact from "@/views/public/contact/Contact";
import ResetPasswordFinish from "@/views/public/reset-password/ResetPasswordFinish";

const PublicRoutes = [
  {
    path: "home",
    name: "homePage",
    component: Home,
    meta: {
      title: "public.pageTitle.homePage"
    }
  },
  {
    path: "about",
    name: "aboutPage",
    component: About,
    meta: {
      title: "public.pageTitle.aboutPage"
    }
  },
  {
    path: "contact",
    name: "contactPage",
    component: Contact,
    meta: {
      title: "public.pageTitle.contactPage"
    }
  },
  {
    path: "reset-password/init",
    name: "resetPasswordInitPage",
    component: ResetPasswordInit,
    meta: {
      title: "public.pageTitle.resetPasswordInitPage"
    }
  },
  {
    path: "reset-password/finish/key=:key?",
    name: "resetPasswordFinishPage",
    component: ResetPasswordFinish,
    meta: {
      title: "public.pageTitle.resetPasswordFinishPage"
    }
  },
  {
    path: "order",
    name: "orderPage",
    component: Order,
    meta: {
      title: "public.pageTitle.orderPage"
    }
  },
  {
    path: "product",
    name: "productPage",
    component: Product,
    meta: {
      title: "public.pageTitle.productPage"
    }
  },
  {
    path: "sale",
    name: "salePage",
    component: Sale,
    meta: {
      title: "public.pageTitle.salePage"
    }
  },
  {
    path: "login",
    name: "loginPage",
    component: Login,
    meta: {
      title: "public.pageTitle.loginPage"
    }
  },
  {
    path: "forbidden",
    name: "forbiddenPage",
    component: Page403,
    meta: {
      title: "public.pageTitle.forbiddenPage"
    }
  },
  {
    path: "not-found",
    name: "notFoundPage",
    component: Page404,
    meta: {
      title: "public.pageTitle.notFoundPage"
    }
  }
];

export default PublicRoutes;
