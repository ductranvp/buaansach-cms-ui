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

        <el-table-column width="100px" v-if="columns.customerPhone.display" prop="customerPhone"
                         :label="columns.customerPhone.label"></el-table-column>

        <el-table-column width="150px" v-if="columns.customerName.display" prop="customerName"
                         :label="columns.customerName.label"></el-table-column>

        <el-table-column width="150px" v-if="columns.customerGender.display" prop="customerGender"
                         :label="columns.customerGender.label">

          <template slot-scope="{row}">
            <el-tag v-if="row.customerGender === 'MALE'">Nam</el-tag>
            <el-tag v-else-if="row.customerGender === 'FEMALE'">Nữ</el-tag>
            <el-tag v-else>Chưa biết</el-tag>
          </template>

        </el-table-column>

        <el-table-column width="130px" v-if="columns.customerZaloStatus.display" prop="customerZaloStatus"
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

        <el-table-column width="100px" v-if="columns.voucherCode.display" prop="voucherCode"
                         :label="columns.voucherCode.label">
          <template slot-scope="{row}">
            <span>{{row.voucherCode | uppercase}}</span>
          </template>
        </el-table-column>

        <el-table-column width="110px" v-if="columns.voucherCodeUsageCount.display" prop="voucherCodeUsageCount"
                         :label="columns.voucherCodeUsageCount.label"></el-table-column>

        <el-table-column width="140px" v-if="columns.voucherCodeSentStatus.display" prop="voucherCodeSentStatus"
                         :label="columns.voucherCodeSentStatus.label">
          <template slot-scope="{row}">
            <el-tag type="success" v-if="row.voucherCodeSentStatus === 'SENT'">Đã gửi</el-tag>
            <el-tag v-else-if="row.voucherCodeSentStatus === 'ARCHIVED'" type="info">Đã lưu trữ</el-tag>
            <el-tag type="danger" v-else>Chưa đặt</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="voucherCodeSent" label="Thao tác" width="180px">
          <template slot-scope="{row}">
            <el-tooltip content="Mã sẽ được kích hoạt">
              <el-button :loading="row.isSending" @click="updateVoucher(row, 'SENT')" type="success" size="small">
                <span>Đã gửi</span>
              </el-button>
            </el-tooltip>

            <el-tooltip content="Mã sẽ bị vô hiệu hóa">
              <el-button :loading="row.isSending" @click="updateVoucher(row, 'ARCHIVED')" type="info" size="small">
                <span>Lưu trữ</span>
              </el-button>
            </el-tooltip>


          </template>
        </el-table-column>
      </data-table>
    </div>
  </el-container>
</template>

<script>
  import CustomerCareCustomerVoucherCodeService
    from "@/service/customer-care/customer-care.customer-voucher-code.service";
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
          customerGender: {label: 'Giới tính', display: false},
          customerPhone: {label: 'SĐT khách', display: true},
          customerZaloStatus: {label: 'Trạng thái Zalo', display: true},
          voucherCode: {label: 'Mã voucher', display: true},
          voucherCodeSentStatus: {label: 'Trạng thái voucher', display: true},
          voucherCodeUsageCount: {label: 'Lượt sử dụng', display: true},
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
          this.$set(row, 'isSending', true);
          await CustomerCareVoucherCodeService.updateVoucherCode({
            voucherCode: row.voucherCode,
            voucherCodeSentStatus: status
          });
          this.$set(row, 'isSending', false);
          this.$set(row, 'voucherCodeSentStatus', status);
        } catch (e) {
          this.$set(row, 'isSending', false);
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
