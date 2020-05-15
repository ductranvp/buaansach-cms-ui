<template>
  <el-aside width="250px" style="border-left: 1px solid #bbb">
    <el-container direction="vertical" class="full-size">
      <el-header height="50px" class="bg-success">
        <el-row class="full-size" type="flex" align="middle" justify="center">
          <span class="text-large text-light">Thông báo</span>
        </el-row>
      </el-header>
      <el-main class="full-size bg-light">

      </el-main>
      <el-footer height="auto">
        <el-row class="full-size bg-light" type="flex" align="middle" justify="center">
          <el-button plain class="full-width no-border-radius no-border" type="danger">
            <i class="el-icon-delete"></i>
            <span>Xóa</span>
          </el-button>
        </el-row>
      </el-footer>
    </el-container>
  </el-aside>
</template>

<script>
  export default {
    name: "ManagerSidebar"
  };
</script>

<style scoped></style>
