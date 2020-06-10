import Roles from "@/config/security/roles";

const AdminStoreDetailChildren = [
  {
    path: "overview",
    name: "adminStoreDetailOverviewPage",
    component: () => import("@/views/private/admin/store/detail/overview/AdminStoreDetailOverview"),
    meta: {
      title: "private.pageTitle.admin.adminStoreDetailOverviewPage",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "human",
    name: "adminStoreDetailHumanPage",
    component: () => import("@/views/private/admin/store/detail/human/AdminStoreUser"),
    meta: {
      title: "private.pageTitle.admin.adminStoreDetailHumanPage",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "work-shift",
    name: "adminStoreDetailWorkShiftPage",
    component: () => import("@/views/private/admin/store/detail/work-shift/AdminStoreDetailWorkShift"),
    meta: {
      title: "private.pageTitle.admin.adminStoreDetailWorkShiftPage",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "sale",
    name: "adminStoreDetailSalePage",
    component: () => import("@/views/private/admin/store/detail/sale/AdminStoreDetailSale"),
    meta: {
      title: "private.pageTitle.admin.adminStoreDetailSalePage",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "area",
    name: "adminStoreDetailAreaPage",
    component: () => import("@/views/private/admin/store/detail/area/AdminStoreDetailArea"),
    meta: {
      title: "private.pageTitle.admin.adminStoreDetailAreaPage",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "seat",
    name: "adminStoreDetailSeatPage",
    component: () => import("@/views/private/admin/store/detail/seat/AdminStoreDetailSeat"),
    meta: {
      title: "private.pageTitle.admin.adminStoreDetailSeatPage",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "product",
    name: "adminStoreProductPage",
    component: () => import("@/views/private/admin/store/detail/product/AdminStoreProduct"),
    meta: {
      title: "private.pageTitle.admin.adminStoreProductPage",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "setting",
    name: "adminStoreDetailSettingPage",
    component: () => import("@/views/private/admin/store/detail/setting/AdminStoreDetailSetting"),
    meta: {
      title: "private.pageTitle.admin.adminStoreDetailSettingPage",
      roles: [Roles.ADMIN]
    }
  }
];
export default AdminStoreDetailChildren;
