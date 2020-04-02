import AdminStoreDetailOverview from "@/views/private/admin/management/store/modules/AdminStoreDetailOverview";
import Roles from "@/config/security/roles";
import AdminStoreDetailHuman from "@/views/private/admin/management/store/modules/AdminStoreDetailHuman";
import AdminStoreDetailWorkShift from "@/views/private/admin/management/store/modules/AdminStoreDetailWorkShift";
import AdminStoreDetailSale from "@/views/private/admin/management/store/modules/AdminStoreDetailSale";
import AdminStoreDetailSetting from "@/views/private/admin/management/store/modules/AdminStoreDetailSetting";
import AdminStoreDetailSeat from "@/views/private/admin/management/store/modules/AdminStoreDetailSeat";

const AdminStoreDetailChildren = [
  {
    path: "overview",
    name: "adminStoreDetailOverviewPage",
    component: AdminStoreDetailOverview,
    meta: {
      parentName: "adminStoreDetailPage",
      title: "private.pageTitle.admin.adminStoreDetailOverviewPage",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "human",
    name: "adminStoreDetailHumanPage",
    component: AdminStoreDetailHuman,
    meta: {
      parentName: "adminStoreDetailPage",
      title: "private.pageTitle.admin.adminStoreDetailHumanPage",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "work-shift",
    name: "adminStoreDetailWorkShiftPage",
    component: AdminStoreDetailWorkShift,
    meta: {
      parentName: "adminStoreDetailPage",
      title: "private.pageTitle.admin.adminStoreDetailWorkShiftPage",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "sale",
    name: "adminStoreDetailSalePage",
    component: AdminStoreDetailSale,
    meta: {
      parentName: "adminStoreDetailPage",
      title: "private.pageTitle.admin.adminStoreDetailSalePage",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "seat",
    name: "adminStoreDetailSeatPage",
    component: AdminStoreDetailSeat,
    meta: {
      parentName: "adminStoreDetailPage",
      title: "private.pageTitle.admin.adminStoreDetailSeatPage",
      roles: [Roles.ADMIN]
    }
  },
  {
    path: "setting",
    name: "adminStoreDetailSettingPage",
    component: AdminStoreDetailSetting,
    meta: {
      parentName: "adminStoreDetailPage",
      title: "private.pageTitle.admin.adminStoreDetailSettingPage",
      roles: [Roles.ADMIN]
    }
  }
];
export default AdminStoreDetailChildren;
