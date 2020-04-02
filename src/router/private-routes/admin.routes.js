import AdminDashboard from "@/views/private/admin/AdminDashboard";
import Roles from "@/config/security/roles";
import AdminStoreList from "@/views/private/admin/management/store/AdminStoreList";
import AdminProduct from "@/views/private/admin/management/AdminProduct";
import AdminUser from "@/views/private/admin/management/AdminUser";
import AdminReport from "@/views/private/admin/management/AdminReport";
import AdminTracker from "@/views/private/admin/management/AdminTracker";
import AdminSetting from "@/views/private/admin/management/AdminSetting";
import AdminStoreDetail from "@/views/private/admin/management/store/AdminStoreDetail";
import AdminStoreDetailChildren from "@/router/private-routes/admin/admin-store-detail.children.routes";

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
    path: "store-list",
    name: "adminStoreListPage",
    component: AdminStoreList,
    meta: {
      title: "private.pageTitle.admin.adminStoreListPage",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "store-detail/:storeGuid?",
    name: "adminStoreDetailPage",
    component: AdminStoreDetail,
    redirect: {name: "adminStoreDetailOverviewPage"},
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
