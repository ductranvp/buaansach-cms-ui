import Roles from "@/config/security/roles";
import AdminStoreDetailChildren from "@/router/private-routes/admin/admin-store-detail.children.routes";

const AdminRoutes = [
  {
    path: "dashboard",
    name: "adminDashboardPage",
    component: () => import("@/views/private/admin/dashboard/AdminDashboard"),
    meta: {
      title: "private.pageTitle.admin.adminDashboardPage",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "store-management",
    name: "adminStoreManagementPage",
    component: () => import("@/views/private/admin/store/management/AdminStoreManagement"),
    meta: {
      title: "private.pageTitle.admin.adminStoreManagementPage",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "store-management/:storeGuid",
    name: "adminStoreDetailPage",
    component: () => import("@/views/private/admin/store/detail/AdminStoreDetail"),
    meta: {
      title: "private.pageTitle.admin.adminStoreDetailPage",
      roles: [Roles.ADMIN]
    },
    children: [
      ...AdminStoreDetailChildren
    ]
  },
  {
    path: "product-management",
    name: "adminProductPage",
    component: () => import("@/views/private/admin/product/AdminProduct"),
    meta: {
      title: "private.pageTitle.admin.adminProductPage",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "category-management",
    name: "adminCategoryPage",
    component: () => import("@/views/private/admin/category/AdminCategory"),
    meta: {
      title: "private.pageTitle.admin.adminCategoryPage",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "user-management",
    name: "adminUserPage",
    component: () => import("@/views/private/admin/user/AdminUser"),
    meta: {
      title: "private.pageTitle.admin.adminUserPage",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "report-management",
    name: "adminReportPage",
    component: () => import("@/views/private/admin/report/AdminReport"),
    meta: {
      title: "private.pageTitle.admin.adminReportPage",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "tracker-management",
    name: "adminTrackerPage",
    component: () => import("@/views/private/admin/tracker/AdminTracker"),
    meta: {
      title: "private.pageTitle.admin.adminTrackerPage",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "setting",
    name: "adminSettingPage",
    component: () => import("@/views/private/admin/setting/AdminSetting"),
    meta: {
      title: "private.pageTitle.admin.adminSettingPage",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "voucher",
    name: "adminVoucherPage",
    component: () => import("@/views/private/admin/voucher/AdminVoucher"),
    meta: {
      title: "private.pageTitle.admin.adminVoucherPage",
      roles: [Roles.ADMIN]
    }
  }
];

export default AdminRoutes;
