<template>
  <el-container direction="vertical">
    <div>
      <el-row :gutter="10">
        <el-col :span="10">
          <el-input
            placeholder="SĐT khách hàng"
            v-model="searchKey"
            @keyup.native.enter="onSearch"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="onSearch"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            :loading="isLoading"
            @click="reloadTableData"
            icon="el-icon-refresh"
          >
            <span>{{ $t("common.entity.action.refresh") }}</span>
          </el-button>
        </el-col>
        <el-col :span="10" class="text-right">
          <el-dropdown trigger="click" :hide-on-click="false">
            <el-button><span>Hiển thị</span></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="key in Object.keys(columns)" :key="key">
                <el-checkbox v-model="columns[key].display">{{columns[key].label}}</el-checkbox>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </div>
    <div class="margin-top-10">
      <data-table
        highlight-current-row
        ref="customerVoucherCodeTable"
        :fetch-data="fetchData"
        show-audit
        :custom-audit="['createdDate', 'lastModifiedDate']"
        :filter="filter"
      >
        <el-table-column v-if="columns.customerCode.display" prop="customerCode"
                         :label="columns.customerCode.label"></el-table-column>

        <el-table-column v-if="columns.customerPhone.display" prop="customerPhone"
                         :label="columns.customerPhone.label"></el-table-column>

        <el-table-column v-if="columns.customerName.display" prop="customerName"
                         :label="columns.customerName.label"></el-table-column>

        <el-table-column v-if="columns.customerZaloStatus.display" prop="customerZaloStatus"
                         :label="columns.customerZaloStatus.label">

          <template slot-scope="{row}">
            <el-select size="small" @change="updateCustomer(row)" v-model="row.customerZaloStatus">
              <el-option v-for="status in customerZaloStatus"
                         :key="status.value"
                         :value="status.value"
                         :label="status.label"></el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column v-if="columns.voucherCode.display" prop="voucherCode"
                         :label="columns.voucherCode.label"></el-table-column>

        <el-table-column v-if="columns.voucherCodeSentStatus.display" prop="voucherCodeSentStatus"
                         :label="columns.voucherCodeSentStatus.label">
          <template slot-scope="{row}">
            <el-tag type="success" v-show="row.voucherCodeSentStatus === 'SENT'">Đã gửi</el-tag>
            <el-tooltip v-show="row.voucherCodeSentStatus === 'ARCHIVED'" content="Khi lưu trữ, mã voucher sẽ không sử dụng được">
              <el-tag type="info">Đã lưu trữ</el-tag>
            </el-tooltip>
            <el-tag type="danger" v-show="row.voucherCodeSentStatus === 'UNSET'">Chưa đặt</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="voucherCodeSent" label="Thao tác" width="180px">
          <template slot-scope="{row}">
            <el-button @click="updateVoucher(row, 'SENT')" type="success" plain size="small">
              <span>Đã gửi</span>
            </el-button>
            <el-button @click="updateVoucher(row, 'ARCHIVED')" type="info" plain size="small">
              <span>Lưu trữ</span>
            </el-button>
          </template>
        </el-table-column>
      </data-table>
    </div>
  </el-container>
</template>

<script>
  import CustomerCareCustomerVoucherCodeService from "@/service/customer-care/customer-care.customer-voucher-code.service";
  import CustomerCareVoucherCodeService from "@/service/customer-care/customer-care.voucher-code.service";
  import NotificationUtils from "@/utils/notification.util";
  import DataTable from "@/components/data-table/DataTable";
  import CustomerCareCustomerService from "@/service/customer-care/customer-care.customer.service";

  export default {
    name: "ListAllVoucher",
    components: {DataTable},
    data() {
      return {
        isLoading: false,
        searchKey: "",
        filter: {
          searchKey: "",
        },
        columns: {
          customerCode: {label: 'Mã khách hàng', display: false},
          customerName: {label: 'Tên khách', display: false},
          customerPhone: {label: 'SĐT khách', display: true},
          customerZaloStatus: {label: 'Trạng thái Zalo', display: true},
          voucherCode: {label: 'Mã voucher', display: true},
          voucherCodeSentStatus: {label: 'Trạng thái voucher', display: true},
        },
        customerZaloStatus: [
          {label: "Chưa biết", value: "UNKNOWN"},
          {label: "Có Zalo", value: "EXIST"},
          {label: "Không có Zalo", value: "NOT_EXIST"},
        ],
        voucherCodeSentStatus: [
          {label: "Chưa đặt", value: "UNSET"},
          {label: "Đã gửi", value: "SENT"},
          {label: "Đã lưu trữ", value: "ARCHIVED"},
        ],
        listUnsentVoucher: []
      };
    },
    methods: {
      async getUnsentVoucher() {
        const {data} = await CustomerCareCustomerVoucherCodeService.getUnsentVoucher();
        this.listUnsentVoucher = data;
      },
      onSearch() {
        this.filter.searchKey = this.searchKey;
      },
      reloadTableData() {
        this.isLoading = true;
        this.filter.searchKey = this.searchKey;
        this.$refs.customerVoucherCodeTable.reload(whenDone);
        const vm = this;

        function whenDone() {
          vm.isLoading = false;
        }
      },
      fetchData(params) {
        return CustomerCareCustomerVoucherCodeService.getListCustomerCode(params);
      },
      async updateVoucher(row, status) {
        try {
          await CustomerCareVoucherCodeService.updateVoucherCode({
            voucherCode: row.voucherCode,
            voucherCodeSentStatus: status
          });
          this.$set(row, 'voucherCodeSentStatus', status);
        } catch (e) {
          NotificationUtils.error("Đã có lỗi xảy ra, vui lòng thử lại");
        }
      },
      async updateCustomer(row) {
        try {
          await CustomerCareCustomerService.updateCustomer({
            customerPhone: row.customerPhone,
            customerZaloStatus: row.customerZaloStatus
          });
        } catch (e) {
          NotificationUtils.error("Đã có lỗi xảy ra, vui lòng thử lại");
        }
      }
    }
  };
</script>

<style scoped>

</style>
