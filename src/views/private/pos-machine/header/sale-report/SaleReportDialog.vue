<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    :before-close="beforeClose"
    :fullscreen="true"
    :show-close="false"
  >
    <div slot="title">
      <el-row type="flex" align="middle">
        <el-col>
          <span>Danh sách đơn hàng</span>
        </el-col>
        <el-col class="text-right">
          <el-dropdown trigger="click">
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
            :label="columns[key].label"
            v-if="columns[key].display">
            <template slot-scope="{row}">
              <el-tag v-if="columns[key].type === 'enum'" :type="columns[key].enum[row[key]].color">
                <span>{{columns[key].enum[row[key]].label}}</span>
              </el-tag>
              <div v-else-if="columns[key].type === 'time'">
                <span v-if="row[key]">{{row[key] | moment("HH:mm:ss DD/MM/YYYY")}}</span>
              </div>
              <div v-else-if="columns[key].type === 'seat'">
                <span>{{ allSeats[row[key]].seatName}} - {{allSeats[row[key]].areaName}}</span>
              </div>
              <div v-else>{{row[key]}}</div>
            </template>
          </el-table-column>
        </template>
      </raw-data-table>
    </el-main>
    <div slot="footer">
      <el-button @click="hide">
        <span>{{$t("common.entity.action.close")}}</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>

  import RawDataTable from "@/components/raw-table-data/RawDataTable";
  import {mapState} from "vuex";

  export default {
    name: "SaleReportDialog",
    components: {RawDataTable},
    computed: {
      ...mapState({
        orderStatus: state => state.posMachine.orderStatus,
        orderType: state => state.posMachine.orderType,
        allSeats: state => {
          let arr = {};
          state.posMachine.allAreas.forEach(area => {
            area.listSeat.forEach(seat => {
              arr[seat.guid] = seat;
            });
          });
          return arr;
        }
      })
    },
    data() {
      return {
        isEdit: false,
        isLoading: false,
        dialogFormVisible: false,
        reportData: [],
        reportType: null,
        columns: {
          orderCode: {label: "Mã đơn", display: true},
          orderType: {
            label: "Loại đơn", display: true, type: "enum",
            enum: {
              IN_STORE: {label: "Ăn tại quán", color: "primary"},
              TAKE_AWAY: {label: "Mang về", color: "primary"},
              ONLINE: {label: "Đặt online", color: "primary"},
              TEST: {label: "Test", color: "primary"},
            }
          },
          orderStatus: {
            label: "Trạng thái", display: true, type: "enum",
            enum: {
              CREATED: {label: "Đã tạo", color: "info"},
              RECEIVED: {label: "Đã tiếp nhận", color: "warning"},
              PURCHASED: {label: "Đã thanh toán", color: "success"},
              CANCELLED_BY_EMPLOYEE: {label: "Hủy bởi nhân viên", color: "danger"},
              CANCELLED_BY_CUSTOMER: {label: "Hủy bởi khách hàng", color: "danger"},
              CANCELLED_BY_SYSTEM: {label: "Hủy bởi hệ thống", color: "danger"},
            }
          },
          seatGuid: {label: "Vị trí", display: true, type: 'seat'},
          orderCheckinTime: {label: "Giờ vào", display: true, type: "time"},
          orderCheckoutTime: {label: "Giờ ra", display: true, type: "time"},
          customerPhone: {label: "SĐT khách hàng", display: true},
          cashierLogin: {label: "Thu ngân", display: true},
          orderDiscount: {label: "Giảm giá", display: false},
          orderDiscountType: {label: "Loại giảm giá", display: false},
          totalAmount: {label: "Tổng đơn", display: false},
          orderNote: {label: "Ghi chú", display: false},
          orderCancelReason: {label: "Lí do hủy", display: false},
          // orderStatusTimeline: {label: "Lịch sử", display: false},
        }
      };
    },
    methods: {
      show(data, type) {
        this.reportType = type;
        if (type === 'cancelled') this.columns.orderCancelReason.display = true;
        else this.columns.orderCancelReason.display = false;
        this.reportData = data;
        this.dialogFormVisible = true;
      },
      hide() {
        this.dialogFormVisible = false;
        this.reportData = [];
      },
      beforeClose(done) {
        this.reportData = [];
        done();
      },
    }
  };
</script>

<style scoped>

</style>
