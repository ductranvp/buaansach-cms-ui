<template>
  <el-aside :width="sideWidth">
    <el-menu
      v-bind="menuProps"
      :collapse="isCollapse"
      :collapse-transition="false"
      :router="true"
    >
      <el-menu-item class="sidebar-logo" @click="toggleSidebar">
        <i v-if="!isCollapse" class="el-icon-d-arrow-left" />
        <i v-else class="el-icon-d-arrow-right" />
        <span v-if="!isCollapse" slot="title">Collapse</span>
        <span v-else slot="title">Show</span>
      </el-menu-item>
      <el-menu-item
        v-for="item in adminRoutes"
        :key="item.name"
        :index="item.name"
        :route="{ name: item.name }"
      >
        <i :class="item.meta.icon" />
        <span slot="title">{{ $t(item.meta.title) }}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: "AdminSidebar",
  data() {
    return {
      menuProps: {
        "default-active": ""
      },
      adminRoutes: [
        {
          name: "adminDashboardPage",
          meta: {
            icon: "el-icon-odometer",
            title: "layout.adminSidebar.adminDashboardPage"
          }
        },
        {
          name: "adminStorePage",
          meta: {
            icon: "el-icon-s-shop",
            title: "layout.adminSidebar.adminStorePage"
          }
        },
        {
          name: "adminProductPage",
          meta: {
            icon: "el-icon-food",
            title: "layout.adminSidebar.adminProductPage"
          }
        },
        {
          name: "adminUserPage",
          meta: {
            icon: "el-icon-user-solid",
            title: "layout.adminSidebar.adminUserPage"
          }
        },
        {
          name: "adminReportPage",
          meta: {
            icon: "el-icon-s-marketing",
            title: "layout.adminSidebar.adminReportPage"
          }
        },
        {
          name: "adminTrackerPage",
          meta: {
            icon: "el-icon-s-help",
            title: "layout.adminSidebar.adminTrackerPage"
          }
        },
        {
          name: "adminSettingPage",
          meta: {
            icon: "el-icon-setting",
            title: "layout.adminSidebar.adminSettingPage"
          }
        }
      ],
      isCollapse: true
    };
  },
  computed: {
    sideWidth() {
      return this.isCollapse ? "64px" : "210px";
    }
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      this.menuProps["default-active"] = to.name;
    }
  },
  created() {
    this.menuProps["default-active"] = this.$route.name;
    this.isCollapse = JSON.parse(localStorage.getItem("adminSidebarCollapse"));
  },
  methods: {
    toggleSidebar() {
      this.isCollapse = !this.isCollapse;
      localStorage.setItem(
        "adminSidebarCollapse",
        JSON.stringify(this.isCollapse)
      );
    }
  }
};
</script>

<style scoped>
.el-menu {
  border-right-width: 0;
}
.is-active {
  background-color: #ecf5ff;
}
</style>
