<template>
  <el-container class="employee-container" direction="horizontal">
    <EmployeeSidebar class="employee-sidebar" />
    <el-container class="employee-main-container" direction="vertical">
      <EmployeeHeader class="employee-header" />
      <EmployeeMain class="employee-main" />
    </el-container>
  </el-container>
</template>

<script>
import EmployeeSidebar from "@/views/layout/employee/modules/EmployeeSidebar";
import EmployeeHeader from "@/views/layout/employee/modules/EmployeeHeader";
import EmployeeMain from "@/views/layout/employee/modules/EmployeeMain";
export default {
  name: "EmployeeLayout",
  components: { EmployeeMain, EmployeeHeader, EmployeeSidebar }
};
</script>

<style scoped>
.employee-container,
.employee-main-container {
  height: 100%;
}
.employee-sidebar {
  background: #aaa;
}
.employee-header {
  background: #eee;
}
.employee-main {
  background: #fff;
}
</style>
