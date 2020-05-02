<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    title=""
    :close-on-click-modal="false"
    :before-close="beforeClose"
    :destroy-on-close="true"
    :show-close="false"
  >
    <div v-loading="isLoading">
      <raw-data-table :data="voucherCodes">
        <el-table-column label="Mã code" prop="voucherCode"></el-table-column>
        <el-table-column label="Khả dụng" prop="voucherCodeUsable">
          <template slot-scope="{row}">
            <el-tag v-if="row.voucherCodeUsable">Có</el-tag>
            <el-tag v-else>Không</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Số lần được sử dụng" prop="voucherCodeUsageCount"></el-table-column>
        <el-table-column label="SĐT Khách" prop="customerPhone"></el-table-column>
      </raw-data-table>
    </div>
    <div slot="footer">
      <el-button @click="hide">
        <span>Đóng</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import RawDataTable from "@/components/raw-table-data/RawDataTable";
  import AdminVoucherService from "@/service/admin/admin.voucher.service";

  export default {
    name: "ListVoucherCodeDialog",
    components: {RawDataTable},
    data() {
      return {
        isEdit: false,
        isLoading: false,
        dialogFormVisible: false,
        voucherCodes: []
      };
    },
    methods: {
      async getVoucherCode(voucherGuid) {
        const {data} = await AdminVoucherService.getListVoucherCode(voucherGuid);
        this.voucherCodes = data;
      },
      show(voucherGuid) {
        this.getVoucherCode(voucherGuid);
        this.dialogFormVisible = true;
      },
      hide() {
        this.dialogFormVisible = false;
        this.resetForm();
      },
      resetForm() {
        this.voucherCodes = [];
      },
      beforeClose(done) {
        this.resetForm();
        done();
      },
    }
  };
</script>

<style scoped>

</style>
