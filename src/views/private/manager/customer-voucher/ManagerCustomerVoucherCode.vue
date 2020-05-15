<template>
  <el-container class="full-size padding-10" direction="vertical">
    <el-tabs v-model="activeName">
      <el-tab-pane label="Khách hàng mới" name="listUnsentVoucher">
        <list-unsent-voucher/>
      </el-tab-pane>
      <el-tab-pane label="Tất cả khách hàng" name="listAllVoucher">
        <list-all-voucher/>
      </el-tab-pane>
    </el-tabs>
  </el-container>
</template>

<script>
  import ListUnsentVoucher from "@/views/private/manager/customer-voucher/ListUnsentVoucher";
  import ListAllVoucher from "@/views/private/manager/customer-voucher/ListAllVoucher";

  export default {
    name: "ManagerCustomerVoucherCode",
    components: {ListAllVoucher, ListUnsentVoucher},
    created() {

    },
    data() {
      return {
        activeName: 'listUnsentVoucher',
      };
    },
  };
</script>

<style scoped>

</style>
