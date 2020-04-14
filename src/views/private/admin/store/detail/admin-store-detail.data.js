const adminStoreDetailData = {
  data() {
    return {
      activeName: 'adminStoreDetailOverviewPage',
      storeGuid: null,
      tabRoutes: [
        {
          routeName: "adminStoreDetailOverviewPage",
          title: "private.adminStoreDetailPage.tabs.overview"
        },
        {
          routeName: "adminStoreDetailHumanPage",
          title: "private.adminStoreDetailPage.tabs.human"
        },
        {
          routeName: "adminStoreDetailAreaPage",
          title: "private.adminStoreDetailPage.tabs.area"
        },
        {
          routeName: "adminStoreDetailSeatPage",
          title: "private.adminStoreDetailPage.tabs.seat"
        },
        {
          routeName: "adminStoreDetailSalePage",
          title: "private.adminStoreDetailPage.tabs.sale"
        },
        {
          routeName: "adminStoreDetailWorkShiftPage",
          title: "private.adminStoreDetailPage.tabs.workShift"
        },
        {
          routeName: "adminStoreDetailSettingPage",
          title: "private.adminStoreDetailPage.tabs.setting"
        }
      ],
      storeEntity: {
        guid: null,
        storeCode: null,
        storeName: null,
        storeAddress: null,
        storeImageUrl: null,
        storeStatus: null,
        storeOwnerName: null,
        storeOwnerPhone: null,
        storeOwnerEmail: null,
        storeTaxCode: null,
        lastUpdateReason: null,
        createdDate: null,
        createdBy: null,
        lastModifiedDate: null,
        lastModifiedBy: null
      }
    };
  },
};

export default adminStoreDetailData;
