import AdminDashboard from "@/views/private/admin/AdminDashboard";
import Roles from "@/config/security/roles";
import AdminStore from "@/views/private/admin/management/store/AdminStore";
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
      title: "private.pageTitle.admin.adminDashboardPage",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "store-management",
    name: "adminStorePage",
    component: AdminStore,
    meta: {
      title: "private.pageTitle.admin.adminStorePage",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "product-management",
    name: "adminProductPage",
    component: AdminProduct,
    meta: {
      title: "private.pageTitle.admin.adminProductPage",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "user-management",
    name: "adminUserPage",
    component: AdminUser,
    meta: {
      title: "private.pageTitle.admin.adminUserPage",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "report-management",
    name: "adminReportPage",
    component: AdminReport,
    meta: {
      title: "private.pageTitle.admin.adminReportPage",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "tracker-management",
    name: "adminTrackerPage",
    component: AdminTracker,
    meta: {
      title: "private.pageTitle.admin.adminTrackerPage",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "setting",
    name: "adminSettingPage",
    component: AdminSetting,
    meta: {
      title: "private.pageTitle.admin.adminSettingPage",
      roles: [Roles.ADMIN]
    }
  }
];

export default AdminRoutes;
