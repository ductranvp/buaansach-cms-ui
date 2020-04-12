const mixinSidebarData = {
  data() {
    return {
      menuProps: {
        'default-active': '',
      },
      adminMenu: [
        {
          routeName: 'adminDashboardPage',
          meta: {
            icon: 'el-icon-odometer',
            title: 'layout.adminSidebar.adminDashboardPage',
          },
        },
        {
          name: "adminStoreManagement",
          title: 'layout.adminSidebar.adminStoreManagement.title',
          icon: 'el-icon-s-shop',
          subMenu: [
            {
              routeName: 'adminStoreListPage',
              meta: {
                icon: 'el-icon-s-management',
                title: 'layout.adminSidebar.adminStoreManagement.adminStoreListPage',
              },
            },
            {
              routeName: 'adminStoreDetailPage',
              meta: {
                icon: 'el-icon-tickets',
                title: 'layout.adminSidebar.adminStoreManagement.adminStoreDetailPage',
              },
            },
          ],
        },
        {
          routeName: 'adminProductPage',
          meta: {
            icon: 'el-icon-food',
            title: 'layout.adminSidebar.adminProductPage',
          },
        },
        {
          routeName: 'adminCategoryPage',
          meta: {
            icon: 'el-icon-s-management',
            title: 'layout.adminSidebar.adminCategoryPage',
          },
        },
        {
          routeName: 'adminUserPage',
          meta: {
            icon: 'el-icon-user-solid',
            title: 'layout.adminSidebar.adminUserPage',
          },
        },
        {
          routeName: 'adminReportPage',
          meta: {
            icon: 'el-icon-s-marketing',
            title: 'layout.adminSidebar.adminReportPage',
          },
        },
        {
          routeName: 'adminTrackerPage',
          meta: {
            icon: 'el-icon-s-help',
            title: 'layout.adminSidebar.adminTrackerPage',
          },
        },
        {
          routeName: 'adminSettingPage',
          meta: {
            icon: 'el-icon-setting',
            title: 'layout.adminSidebar.adminSettingPage',
          },
        },
      ],
      isCollapse: true,
    };
  },
};
export default mixinSidebarData;
