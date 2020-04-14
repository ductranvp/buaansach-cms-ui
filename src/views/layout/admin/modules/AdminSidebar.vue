<template>
  <el-aside class="sidebar-container" :width="sideWidth">
    <sidebar-logo :collapse="adminSidebarCollapse"/>
    <el-menu v-bind="menuProps"
             :collapse="adminSidebarCollapse"
             :collapse-transition="false"
             :background-color="variables.menuBg"
             :text-color="variables.menuText"
             :active-text-color="variables.menuActiveText"
             :router="true">
      <sidebar-item v-for="item in adminMenu" :item="item" :key="item.routeName"/>
    </el-menu>
  </el-aside>
</template>

<script>
  import mixinSidebarData from "@/views/layout/admin/modules/admin-side-bar.data";
  import {mapState} from "vuex";
  import SidebarLogo from "@/views/layout/admin/modules/components/SidebarLogo";
  import SidebarItem from "@/views/layout/admin/modules/components/SidebarItem";

  export default {
    name: 'AdminSidebar',
    components: {SidebarItem, SidebarLogo},
    mixins: [mixinSidebarData],
    computed: {
      ...mapState({
        adminSidebarCollapse: state => state.app.adminSidebarCollapse,
      }),
      sideWidth() {
        return this.adminSidebarCollapse ? '64px' : '192px';
      },
    },
    watch: {
      $route(to, from) {
        this.menuProps['default-active'] = to.name;
      },
    },
    created() {
      this.menuProps['default-active'] = this.$route.name;
    },
    methods: {},
  };
</script>

<style scoped>
  .el-menu {
    border-right-width: 0;
  }

  .sidebar-container {
    background-color: #304156;
    height: 100%;
    overflow: hidden;
  }
</style>
