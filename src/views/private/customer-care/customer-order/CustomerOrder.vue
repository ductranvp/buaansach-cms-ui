<template>
  <el-container direction="vertical" class="full-size padding-10">
    <el-header height="auto">
      <el-row :gutter="10" type="flex" align="middle">
        <el-col>
          <el-date-picker
            :format="dateFormat"
            v-model="dateRange"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="tới"
            start-placeholder="Ngày bắt đầu"
            end-placeholder="Ngày kết thúc"
            align="right">
          </el-date-picker>
        </el-col>
        <el-col>
          <el-input v-model="form.customerPhone" placeholder="SĐT Khách"></el-input>
        </el-col>
        <el-col>
          <el-input v-model="form.orderCountMin" placeholder="Lần thanh toán (min)"></el-input>
        </el-col>
        <el-col>
          <el-input v-model="form.orderCountMax" placeholder="Lần thanh toán (max)"></el-input>
        </el-col>
        <el-col>
          <el-select v-model="form.customerCareStatus" placeholder="Trạng thái">
            <el-option label="Tất cả"
                       :value="null"></el-option>
            <el-option v-for="item in customerCareStatus" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" justify="center" class="padding-10-0">
        <el-button @click="getListCustomerOrder" type="primary" :loading="isLoading">Lấy danh sách</el-button>
      </el-row>
      <el-divider class="margin-0"></el-divider>
    </el-header>
    <el-main class="full-size" v-loading="isLoading">
      <raw-data-table highlight-current-row :data="listCustomerOrder" show-audit :custom-audit="['createdDate']"
                      show-index>
        <template slot="expand">
          <el-table-column type="expand">
            <template slot-scope="{row}">
              <customer-order-row-detail :row="row"/>
            </template>
          </el-table-column>
        </template>
        <el-table-column label="Số điện thoại" prop="customerPhone" sortable></el-table-column>
        <el-table-column prop="orderCount" width="50px">
          <template slot="header">
            <el-tooltip content="Lần thanh toán">
              <span>
                LTT
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái" prop="customerCareStatus">
          <template slot-scope="{row}">
            <div v-show="row.isEdit">
              <el-select size="small" v-model="row.customerCareStatus" placeholder="Trạng thái">
                <el-option v-for="item in customerCareStatus" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </div>
            <div v-show="!row.isEdit">
              <el-tag type="warning" v-if="row.customerCareStatus === 'PENDING'">Đang chờ</el-tag>
              <el-tag type="success" v-else-if="row.customerCareStatus === 'DONE'">Đã chăm sóc</el-tag>
              <el-tag type="info" v-else-if="row.customerCareStatus === 'LATER'">Chăm sóc sau</el-tag>
              <el-tag type="danger" v-else>Bỏ qua</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Phản hồi" width="250px">
          <template slot-scope="{row}">
            <el-input :disabled="!row.isEdit" type="textarea" rows="2" v-model="row.customerOrderFeedback"></el-input>
          </template>
        </el-table-column>
        <template slot="action">
          <el-table-column label="Thao tác" width="220px">
            <template slot-scope="{row}">
              <el-row>
                <el-button v-if="!row.isEdit" size="small" type="warning" @click="editRow(row)">Sửa</el-button>
                <template v-else>
                  <el-button :loading="row.isSaving" type="success" @click="updateCustomerOrder(row)" size="small">Lưu
                  </el-button>
                  <el-button size="small" type="info" @click="cancelEditRow(row)">Hủy</el-button>
                </template>
                <el-button type="primary" @click="showDetail(row)" size="small">Chi tiết</el-button>
              </el-row>
            </template>
          </el-table-column>
        </template>
      </raw-data-table>
    </el-main>
    <customer-order-detail-dialog ref="orderDetailDialog"/>
  </el-container>
</template>

<script>
  import CustomerCareCustomerOrderService from "@/service/customer-care/customer-care.customer-order.service";
  import NotificationUtils from "@/utils/notification.util";
  import RawDataTable from "@/components/raw-table-data/RawDataTable";
  import MessageUtils from "@/utils/message.util";
  import CustomerOrderRowDetail from "@/views/private/customer-care/customer-order/CustomerOrderRowDetail";
  import CustomerOrderDetailDialog from "@/views/private/customer-care/customer-order/CustomerOrderDetailDialog";

  export default {
    name: "CustomerOrder",
    components: {CustomerOrderDetailDialog, CustomerOrderRowDetail, RawDataTable},
    data() {
      const defaultEnd = new Date();
      const defaultStart = new Date();
      defaultStart.setHours(0, 0, 0, 0);
      defaultEnd.setHours(23, 59, 59, 0);

      return {
        isLoading: false,
        dateFormat: 'HH:mm:ss dd/MM/yyyy',
        pickerOptions: {
          shortcuts: [
            {
              text: 'Hôm nay',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 0);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: 'Hôm qua',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24);
                start.setHours(0, 0, 0, 0);
                end.setHours(0, 0, 0, 0);
                end.setTime(end.getTime() - 1000);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '7 ngày trước',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                start.setHours(0, 0, 0, 0);
                end.setHours(0, 0, 0, 0);
                end.setTime(end.getTime() - 1000);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '30 ngày trước',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                start.setHours(0, 0, 0, 0);
                end.setHours(0, 0, 0, 0);
                end.setTime(end.getTime() - 1000);
                picker.$emit('pick', [start, end]);
              }
            }]
        },
        form: {
          startDate: null,
          endDate: null,
          customerPhone: null,
          customerCareStatus: "PENDING",
          orderCountMin: null,
          orderCountMax: null,
        },
        customerCareStatus: [
          {label: "Đang chờ", value: "PENDING"},
          {label: "Đã chăm sóc", value: "DONE"},
          {label: "Chăm sóc sau", value: "LATER"},
          {label: "Bỏ qua", value: "IGNORE"},
        ],
        dateRange: [defaultStart, defaultEnd],
        listCustomerOrder: []
      };
    },
    created() {
      this.getListCustomerOrder();
    },
    methods: {
      async getListCustomerOrder() {
        try {
          this.isLoading = true;
          this.form.startDate = this.dateRange[0];
          this.form.endDate = this.dateRange[1];
          let {data} = await CustomerCareCustomerOrderService.getListCustomerOrder(this.form);
          data = data.map(item => {
            item.isEdit = false;
            item.isSaving = false;
            item.previousCustomerCareStatus = null;
            item.previousCustomerOrderFeedback = null;
            return item;
          });
          this.listCustomerOrder = data;
          this.isLoading = false;
        } catch (e) {
          this.isLoading = false;
          NotificationUtils.error("Lỗi tải dữ liệu. Vui lòng thử lại sau!");
        }
      },
      editRow(row) {
        row.isEdit = true;
        row.previousCustomerCareStatus = row.customerCareStatus;
        row.previousCustomerOrderFeedback = row.customerOrderFeedback;
      },
      cancelEditRow(row) {
        row.isEdit = false;
        row.customerCareStatus = row.previousCustomerCareStatus;
        row.customerOrderFeedback = row.previousCustomerOrderFeedback;
      },
      async updateCustomerOrder(row) {
        const payload = {
          guid: row.guid,
          customerCareStatus: row.customerCareStatus,
          customerOrderFeedback: row.customerOrderFeedback
        };
        try {
          row.isSaving = true;
          await CustomerCareCustomerOrderService.updateCustomerOrder(payload);
          row.isSaving = false;
          row.isEdit = false;
          MessageUtils.success("Cập nhật thành công");
        } catch (e) {
          row.isSaving = false;
          MessageUtils.error("Lỗi cập nhật dữ liệu");
        }
      },
      showDetail(row) {
        this.$refs.orderDetailDialog.show(row.orderGuid);
      }
    }
  };
</script>

<style scoped>
</style>
