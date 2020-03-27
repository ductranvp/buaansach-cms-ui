import AdminDashboard from "@/views/private/admin/AdminDashboard";
import Roles from "@/config/security/roles";
import AdminStore from "@/views/private/admin/management/AdminStore";
import AdminProduct from "@/views/private/admin/management/AdminProduct";
import AdminUser from "@/views/private/admin/management/AdminUser";
import AdminReport from "@/views/private/admin/management/AdminReport";
import AdminTracker from "@/views/private/admin/management/AdminTracker";
import AdminSetting from "@/views/private/admin/management/AdminSetting";

const AdminRoutes = [
  {
    path: "dashboard",
    name: "adminDashboardPage",
    component: AdminDashboard,
    meta: {
      title: "private.adminDashboardPage.pageTitle",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "store-management",
    name: "adminStorePage",
    component: AdminStore,
    meta: {
      title: "private.adminStorePage.pageTitle",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "product-management",
    name: "adminProductPage",
    component: AdminProduct,
    meta: {
      title: "private.adminProductPage.pageTitle",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "user-management",
    name: "adminUserPage",
    component: AdminUser,
    meta: {
      title: "private.adminUserPage.pageTitle",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "report-management",
    name: "adminReportPage",
    component: AdminReport,
    meta: {
      title: "private.adminReportPage.pageTitle",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "tracker-management",
    name: "adminTrackerPage",
    component: AdminTracker,
    meta: {
      title: "private.adminTrackerPage.pageTitle",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "setting",
    name: "adminSettingPage",
    component: AdminSetting,
    meta: {
      title: "private.adminSettingPage.pageTitle",
      roles: [Roles.ADMIN]
    }
  }
];

export default AdminRoutes;
