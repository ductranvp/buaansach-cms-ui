<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    :before-close="beforeClose"
    :fullscreen="true"
    :show-close="false"
    :append-to-body="true"
  >
    <div slot="title">
      <el-row type="flex" align="middle">
        <el-col>
          <el-row type="flex" align="middle">
            <el-col>
              <el-input
                placeholder="Tìm theo mã đơn hoặc SĐT"
                v-model="searchKey"
                @keypress.enter.native="onSearch"
                clearable
              >
                <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
              </el-input>
            </el-col>
          </el-row>
        </el-col>
        <el-col class="text-right">
          <el-dropdown trigger="click" :hide-on-click="false">
            <el-button size="mini"><span>Hiển thị</span></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="key in Object.keys(columns)" :key="key">
                <el-checkbox v-model="columns[key].display">{{columns[key].label}}</el-checkbox>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </div>
    <el-main>
      <raw-data-table :data="reportData" show-index>
        <template v-for="key in Object.keys(columns)">
          <el-table-column
            :key="key"
            :prop="key"
            :sortable="columns[key].sortable"
            :label="columns[key].label"
            v-if="columns[key].display">
            <template slot-scope="{row}">
              <el-tag v-if="columns[key].type === 'enum' && columns[key].enum[row[key]]"
                      :type="columns[key].enum[row[key]].color">
                <span>{{columns[key].enum[row[key]].label}}</span>
              </el-tag>
              <div v-else-if="columns[key].type === 'time'">
                <span v-if="row[key]">{{row[key] | moment("HH:mm:ss - DD/MM/YYYY")}}</span>
              </div>
              <div v-else-if="columns[key].type === 'seat'">
                <span>{{ allSeatsObject[row[key]].seatName}} - {{allSeatsObject[row[key]].areaName}}</span>
              </div>
              <div v-else-if="columns[key].type === 'history'">

              </div>
              <div v-else>{{row[key]}}</div>
            </template>
          </el-table-column>
        </template>
        <el-table-column label="Lịch sử" v-if="['STORE_MANAGER', 'STORE_OWNER'].includes(this.currentStoreUserRole)">
          <template slot-scope="{row}">
            <el-button size="small" type="primary" @click="showOrderHistory(row)">Xem</el-button>
          </template>
        </el-table-column>
      </raw-data-table>
    </el-main>
    <div slot="footer">
      <el-button @click="hide">
        <span>{{$t("common.entity.action.close")}}</span>
      </el-button>
    </div>
    <order-history-dialog :current-store-user-role="currentStoreUserRole" ref="orderHistoryDialog"/>
  </el-dialog>
</template>

<script>

  import RawDataTable from "@/components/raw-table-data/RawDataTable";
  import {mapState} from "vuex";
  import OrderHistoryDialog from "@/views/private/pos/header/sale-report/OrderHistoryDialog";

  export default {
    name: "SaleReportDetailDialog",
    components: {OrderHistoryDialog, RawDataTable},
    props: {
      currentStoreUserRole: String,
    },
    computed: {
      ...mapState({
        orderStatus: state => state.posMachine.orderStatus,
        orderType: state => state.posMachine.orderType,
        allSeatsObject: state => state.posMachine.allSeatsObject,
      })
    },
    data() {
      return {
        searchKey: "",
        dialogFormVisible: false,
        originalReportData: [],
        reportData: [],
        reportType: null,
        columns: {
          orderCode: {label: "Mã đơn", display: true, sortable: true},
          orderType: {
            label: "Loại đơn", display: true, type: "enum",
            enum: {
              IN_STORE: {label: "Ăn tại quán", color: "primary"},
              TAKE_AWAY: {label: "Mang về", color: "primary"},
              ONLINE: {label: "Đặt online", color: "primary"},
            }
          },
          orderStatus: {
            label: "Trạng thái", display: true, type: "enum", sortable: true,
            enum: {
              CREATED: {label: "Đã tạo", color: "info"},
              RECEIVED: {label: "Đã tiếp nhận", color: "warning"},
              PURCHASED: {label: "Đã thanh toán", color: "success"},
              CANCELLED: {label: "Đã hủy", color: "danger"},
            }
          },
          seatGuid: {label: "Vị trí", display: true, type: 'seat'},
          createdDate: {label: "Giờ vào", display: true, type: "time", sortable: true},
          orderCustomerPhone: {label: "SĐT khách", display: true},
          orderReceivedBy: {label: "Thu ngân", display: true},
          orderDiscount: {label: "Giảm giá", display: false},
          orderDiscountType: {
            label: "Loại giảm giá", display: false,
            type: "enum",
            enum: {
              VALUE: {label: "Giá trị", color: "primary"},
              PERCENT: {label: "Phần trăm", color: "primary"},
            }
          },
          orderTotalAmount: {label: "Tổng đơn", display: false},
          orderCancelReason: {label: "Lí do hủy", display: false},
        }
      };
    },
    methods: {
      show(data, type) {
        this.reportType = type;
        this.resetDisplay();
        if (type === 'cancelled') this.columns.orderCancelReason.display = true;
        if (type === 'purchased') {
          this.columns.orderDiscount.display = true;
          this.columns.orderDiscountType.display = true;
          this.columns.orderTotalAmount.display = true;
        }
        this.originalReportData = data;
        this.reportData = data;
        this.dialogFormVisible = true;
      },
      resetDisplay() {
        this.columns.orderDiscount.display = false;
        this.columns.orderDiscountType.display = false;
        this.columns.orderTotalAmount.display = false;
        this.columns.orderCancelReason.display = false;
      },
      hide() {
        this.dialogFormVisible = false;
        this.originalReportData = [];
        this.reportData = [];
        this.searchKey = null;
      },
      beforeClose(done) {
        this.originalReportData = [];
        this.reportData = [];
        done();
      },
      showOrderHistory(data) {
        this.$refs.orderHistoryDialog.show(data);
      },
      onSearch() {
        if (this.searchKey) {
          this.reportData = this.originalReportData.filter(item => item.orderCode.includes(this.searchKey) ||
            (item.orderCustomerPhone && item.orderCustomerPhone.includes(this.searchKey)));
        } else {
          this.reportData = this.originalReportData;
        }
      },
    }
  };
</script>

<style scoped>

</style>
