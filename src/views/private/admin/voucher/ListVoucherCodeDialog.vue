<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    title=""
    :close-on-click-modal="false"
    :before-close="beforeClose"
    :destroy-on-close="true"
    :show-close="false"
    :fullscreen="fullscreen"
    width="70%"
  >
    <div slot="title">
      <el-row type="flex" align="middle">
        <el-checkbox v-model="codeUppercase">Mã code viết hoa</el-checkbox>
        <el-col class="text-right">
          <i class="el-icon-full-screen" @click="fullscreen = !fullscreen"></i>
        </el-col>
      </el-row>
    </div>
    <div v-loading="isLoading">
      <raw-data-table :data="voucherCodes" show-index>
        <el-table-column label="Mã code" prop="voucherCode">
          <template slot-scope="{row}">
            <span v-if="codeUppercase">{{row.voucherCode | uppercase}}</span>
            <span v-else>{{row.voucherCode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Khả dụng" prop="voucherCodeUsable" sortable>
          <template slot-scope="{row}">
            <el-tag v-if="row.voucherCodeUsable">Có</el-tag>
            <el-tag v-else>Không</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Số lần được sử dụng" prop="voucherCodeUsageCount"></el-table-column>
        <el-table-column label="SĐT Khách" prop="customerPhone"></el-table-column>
        <el-table-column label="Trạng thái" prop="voucherCodeClaimStatus">
          <template slot-scope="{row}">
            <el-select size="small" @change="updateVoucherCode(row)" v-model="row.voucherCodeClaimStatus">
              <el-option v-for="status in voucherCodeClaimStatus"
                         :key="status.value"
                         :value="status.value"
                         :label="status.label"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="Thao tác">
          <template slot-scope="{row}">
            <el-button v-if="row.voucherCodeUsable" @click="toggleVoucherCode(row)" type="danger" size="mini">
              <span>Vô hiệu hóa</span>
            </el-button>
            <el-button v-else @click="toggleVoucherCode(row)" type="success" size="mini">Kích hoạt</el-button>
          </template>
        </el-table-column>
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
  import AdminVoucherCodeService from "@/service/admin/admin.voucher-code.service";
  import NotificationUtils from "@/utils/notification.util";

  export default {
    name: "ListVoucherCodeDialog",
    components: {RawDataTable},
    data() {
      return {
        isEdit: false,
        fullscreen: false,
        codeUppercase: false,
        isLoading: false,
        dialogFormVisible: false,
        voucherCodes: [],
        voucherCodeClaimStatus: [
          {label: "Chưa biết", value: "UNSET"},
          {label: "Đã gửi", value: "CLAIMED"},
          {label: "Đã lưu trữ", value: "ARCHIVED"},
        ],
      };
    },
    methods: {
      async toggleVoucherCode(row) {
        try {
          await AdminVoucherCodeService.toggleVoucherCode(row.voucherCode);
          row.voucherCodeUsable = !row.voucherCodeUsable;
        } catch (e) {
          NotificationUtils.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
        }
      },
      async updateVoucherCode(row) {
        try {
          const payload = {
            voucherCode: row.voucherCode,
            voucherCodeClaimStatus: row.voucherCodeClaimStatus
          };
          await AdminVoucherCodeService.updateVoucherCode(payload);
        } catch (e) {
          NotificationUtils.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
        }
      },
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
