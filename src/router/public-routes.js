import Login from "@/views/public/login/Login";
import Home from "@/views/public/home/Home";
import Page403 from "@/views/public/error-page/Page403";
import Page404 from "@/views/public/error-page/Page404";
import About from "@/views/public/about/About";
import Sale from "@/views/public/sale/Sale";
import Product from "@/views/public/product/Product";
import Order from "@/views/public/order/Order";
import ResetPassword from "@/views/public/reset-password/ResetPassword";
import Contact from "@/views/public/contact/Contact";

const PublicRoutes = [
  {
    path: "/",
    name: "HomePage",
    component: Home,
    meta: {
      title: "Home"
    }
  },
  {
    path: "/about",
    name: "AboutPage",
    component: About,
    meta: {
      title: "About"
    }
  },
  {
    path: "/contact",
    name: "ContactPage",
    component: Contact,
    meta: {
      title: "Contact"
    }
  },
  {
    path: "/reset-password",
    name: "ResetPasswordPage",
    component: ResetPassword,
    meta: {
      title: "Reset Password"
    }
  },
  {
    path: "/order",
    name: "OrderPage",
    component: Order,
    meta: {
      title: "Order"
    }
  },
  {
    path: "/product",
    name: "ProductPage",
    component: Product,
    meta: {
      title: "Product"
    }
  },
  {
    path: "/sale",
    name: "SalePage",
    component: Sale,
    meta: {
      title: "Sale"
    }
  },
  {
    path: "/login",
    component: Login,
    name: "LoginPage",
    meta: {
      title: "Login"
    }
  },
  {
    path: "/forbidden",
    component: Page403,
    name: "403Page",
    meta: {
      title: "Forbidden"
    }
  },
  {
    path: "/not-found",
    component: Page404,
    name: "404Page",
    meta: {
      title: "Not Found"
    }
  }
];

export default PublicRoutes;
