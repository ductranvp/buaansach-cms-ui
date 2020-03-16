<template>
  <div>
    <el-table :data="tableData">
      <el-table-column prop="date" label="Date" width="140" />
      <el-table-column prop="name" label="Name" width="120" />
      <el-table-column prop="address" label="Address" />
    </el-table>
    <router-link class="pan-btn blue-btn" to="/documentation/index">
      Documentation
    </router-link>
  </div>
</template>

<script>
export default {
  name: "AdminDashboard",
  data() {
    const item = {
      date: "2016-05-02",
      name: "Tom",
      address: "No. 189, Grove St, Los Angeles"
    };
    return {
      tableData: Array(20).fill(item)
    };
  }
};
</script>

<style scoped></style>
