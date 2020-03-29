<template>
  <el-container class="admin-container" direction="horizontal">
    <AdminSidebar class="admin-sidebar" />
    <el-container class="admin-main-container" direction="vertical">
      <AdminHeader class="admin-header" />
      <AdminMain class="admin-main" />
    </el-container>
  </el-container>
</template>

<script>
import AdminSidebar from "@/views/layout/admin/modules/AdminSidebar";
import AdminHeader from "@/views/layout/admin/modules/AdminHeader";
import AdminMain from "@/views/layout/admin/modules/AdminMain";
export default {
  name: "AdminLayout",
  components: { AdminMain, AdminHeader, AdminSidebar }
};
</script>

<style scoped>
.admin-container,
.admin-main-container {
  height: 100%;
}
.admin-sidebar {
  background: transparent;
  border-right: 1px solid #bbb;
  box-sizing: border-box;
  overflow-x: hidden;
}
.admin-header {
  background: #eee;
}
.admin-main {
  background: #fff;
  overflow-x: hidden !important;
  padding: 10px !important; /* override file override.css */
}
</style>
