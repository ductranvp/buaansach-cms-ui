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
    path: "/",
    name: "HomePage",
    component: Home,
    meta: {
      title: "public.homePage.pageTitle"
    }
  },
  {
    path: "about",
    name: "AboutPage",
    component: About,
    meta: {
      title: "public.aboutPage.pageTitle"
    }
  },
  {
    path: "contact",
    name: "ContactPage",
    component: Contact,
    meta: {
      title: "public.contactPage.pageTitle"
    }
  },
  {
    path: "reset-password/init",
    name: "ResetPasswordInitPage",
    component: ResetPasswordInit,
    meta: {
      title: "public.resetPasswordInitPage.pageTitle"
    }
  },
  {
    path: "reset-password/finish?key=:key",
    name: "ResetPasswordFinishPage",
    component: ResetPasswordFinish,
    meta: {
      title: "public.resetPasswordFinishPage.pageTitle"
    }
  },
  {
    path: "order",
    name: "OrderPage",
    component: Order,
    meta: {
      title: "public.orderPage.pageTitle"
    }
  },
  {
    path: "product",
    name: "ProductPage",
    component: Product,
    meta: {
      title: "public.productPage.pageTitle"
    }
  },
  {
    path: "sale",
    name: "SalePage",
    component: Sale,
    meta: {
      title: "public.salePage.pageTitle"
    }
  },
  {
    path: "login",
    component: Login,
    name: "LoginPage",
    meta: {
      title: "public.loginPage.pageTitle"
    }
  },
  {
    path: "forbidden",
    component: Page403,
    name: "403Page",
    meta: {
      title: "public.forbiddenPage.pageTitle"
    }
  },
  {
    path: "not-found",
    component: Page404,
    name: "404Page",
    meta: {
      title: "public.notFoundPage.pageTitle"
    }
  }
];

export default PublicRoutes;
