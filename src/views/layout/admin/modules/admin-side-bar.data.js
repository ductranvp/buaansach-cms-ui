const mixinSidebarData = {
  data() {
    return {
      variables: {
        menuBg: "#304156",
        menuText: "#bfcbd9",
        menuActiveText: "#409EFF",
      },
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
          routeName: 'adminStoreListPage',
          meta: {
            icon: 'el-icon-s-shop',
            title: 'layout.adminSidebar.adminStoreManagement.title',
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
          routeName: 'adminProductPage',
          meta: {
            icon: 'el-icon-food',
            title: 'layout.adminSidebar.adminProductPage',
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
