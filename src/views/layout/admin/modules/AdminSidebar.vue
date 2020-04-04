<template>
  <el-aside :width="sideWidth">
    <el-menu v-bind="menuProps"
             :default-openeds="['adminStoreManagement']"
             :collapse="isCollapse"
             :collapse-transition="false"
             :router="true">
      <el-menu-item class="sidebar-logo" @click="toggleSidebar">
        <i v-if="!isCollapse" class="el-icon-d-arrow-left"/>
        <i v-else class="el-icon-d-arrow-right"/>
        <span v-if="!isCollapse" slot="title">
          {{$t("layout.adminSidebar.collapse")}}
        </span>
        <span v-else slot="title">
          {{$t("layout.adminSidebar.show")}}
        </span>
      </el-menu-item>
      <template v-for="menu in adminMenu">
        <el-submenu v-if="menu.subMenu && menu.subMenu.length > 0" :index="menu.name" :key="menu.title">
          <template slot="title">
            <i :class="menu.icon"></i>
            <span slot="title">{{ $t(menu.title) }}</span>
          </template>

          <el-menu-item v-for="child in menu.subMenu"
                        :route="{ name: child.routeName }"
                        :index="child.routeName"
                        :key="child.routeName">
            <i class="el-icon-star-off"></i><span slot="title">{{ $t(child.meta.title) }}</span>
          </el-menu-item>
        </el-submenu>

        <el-menu-item v-else
                      :route="{ name: menu.routeName }"
                      :index="menu.routeName"
                      :key="menu.routeName">
          <i :class="menu.meta.icon"></i><span slot="title">{{ $t(menu.meta.title) }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </el-aside>
</template>

<script>
  import mixinSidebarData from "@/views/layout/admin/modules/admin-side-bar.data";

  export default {
    name: 'AdminSidebar',
    mixins: [mixinSidebarData],
    computed: {
      sideWidth() {
        return this.isCollapse ? '64px' : '210px';
      },
    },
    watch: {
      $route(to, from) {
        if (to.meta.parentName) this.menuProps['default-active'] = to.meta.parentName;
        else this.menuProps['default-active'] = to.name;
      },
    },
    created() {
      if (this.$route.meta.parentName) this.menuProps['default-active'] = this.$route.meta.parentName;
      else this.menuProps['default-active'] = this.$route.name;
      this.isCollapse = JSON.parse(localStorage.getItem('adminSidebarCollapse'));
    },
    methods: {
      toggleSidebar() {
        this.isCollapse = !this.isCollapse;
        localStorage.setItem('adminSidebarCollapse', JSON.stringify(this.isCollapse));
      },
    },
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
