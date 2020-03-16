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
        <span slot="title">{{ item.meta.label }}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script>
import AdminRoutes from "@/router/private-routes/admin-routes";

export default {
  name: "AdminSidebar",
  data() {
    return {
      menuProps: {
        "default-active": ""
      },
      isCollapse: true,
      adminRoutes: []
    };
  },
  computed: {
    sideWidth() {
      return this.isCollapse ? "64px" : "150px";
    }
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      this.menuProps["default-active"] = to.name;
    }
  },
  created() {
    this.adminRoutes = AdminRoutes;
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
