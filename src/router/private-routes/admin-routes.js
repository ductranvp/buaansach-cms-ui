import AdminDashboard from "@/views/private/admin/AdminDashboard";
import Roles from "@/security/roles";
import AdminStore from "@/views/private/admin/management/AdminStore";
import AdminProduct from "@/views/private/admin/management/AdminProduct";
import AdminUser from "@/views/private/admin/management/AdminUser";
import AdminReport from "@/views/private/admin/management/AdminReport";
import AdminTracker from "@/views/private/admin/management/AdminTracker";
import AdminSetting from "@/views/private/admin/management/AdminSetting";

const AdminRoutes = [
  {
    path: "dashboard",
    component: AdminDashboard,
    name: "AdminDashboardPage",
    meta: {
      icon: "el-icon-odometer",
      title: "Dashboard",
      label: "Dashboard", // use for sidebar menu
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "store-management",
    component: AdminStore,
    name: "AdminStorePage",
    meta: {
      icon: "el-icon-s-shop",
      title: "Store Management",
      label: "Store", // use for sidebar menu
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "product-management",
    component: AdminProduct,
    name: "AdminProductPage",
    meta: {
      icon: "el-icon-food",
      title: "Product Management",
      label: "Product", // use for sidebar menu
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "user-management",
    component: AdminUser,
    name: "AdminUserPage",
    meta: {
      icon: "el-icon-user-solid",
      title: "User Management",
      label: "User", // use for sidebar menu
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "report-management",
    component: AdminReport,
    name: "AdminReportPage",
    meta: {
      icon: "el-icon-s-marketing",
      title: "Report Management",
      label: "Report", // use for sidebar menu
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "tracker-management",
    component: AdminTracker,
    name: "AdminTrackerPage",
    meta: {
      icon: "el-icon-s-help",
      title: "Tracker Management",
      label: "Tracker", // use for sidebar menu
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "setting",
    component: AdminSetting,
    name: "AdminSettingPage",
    meta: {
      icon: "el-icon-setting",
      title: "Setting",
      label: "Setting",
      roles: [Roles.ADMIN]
    }
  }
];

export default AdminRoutes;
