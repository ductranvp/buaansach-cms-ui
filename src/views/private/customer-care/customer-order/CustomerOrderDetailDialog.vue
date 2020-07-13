<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    title=""
    :close-on-click-modal="true"
    :before-close="beforeClose"
    :show-close="false"
    width="75%"
  >
    <div slot="title">
      <el-row type="flex" align="middle">
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
    <el-container v-loading="isLoading" class="full-width">
      <el-main v-if="!isLoading" class="full-width">
        <el-row type="flex" align="top" class="full-width">
          <raw-data-table :data="[order]" class="full-width" :show-pagination="false">
            <template v-for="key in Object.keys(columns)">
              <el-table-column
                :key="key"
                :prop="key"
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
                  <div v-else-if="columns[key].type === 'history'">

                  </div>
                  <div v-else>{{row[key]}}</div>
                </template>
              </el-table-column>
            </template>
          </raw-data-table>
        </el-row>
        <el-row type="flex" align="top" class="full-width">
          <el-col :span="11">
            <div>
              <p class="text-large"><b>Lịch sử thao tác:</b></p>
            </div>
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :timestamp="activity.timestamp"
                placement="top">
                <el-card shadow="never" :body-style="{padding: '10px'}">
                  <p><b>{{orderStatus[activity.action]}}</b></p>
                  <p v-if="activity.metaData">{{activity.metaData}}</p>
                  <p>Người thực hiện: {{activity.actor}}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-col>
          <el-col :span="11" :offset="2">
            <div>
              <p class="text-large"><b>Danh sách món đã gọi:</b></p>
            </div>
            <el-row v-for="item in listOrderProduct" :key="item.guid">
              <el-card :body-style="{padding: '20px 10px 10px 0px', position: 'relative'}"
                       class="margin-bottom-5"
                       shadow="never">
                <el-tag style="position: absolute; top: 0; left:0" size="mini" type="info" class="no-border-radius">
                  <el-tooltip :content="$moment(item.createdDate).format('HH:mm:ss - DD/MM/YYYY')">
                    <span>{{item.createdDate | moment("HH:mm:ss")}}</span>
                  </el-tooltip>
                </el-tag>
                <el-row type="flex" align="middle">
                  <div class="text-bold text-very-large padding-0-20">
                    <span>{{item.orderProductQuantity}}</span>
                  </div>
                  <el-row class="full-size" type="flex" align="middle">
                    <el-col :span="9" class="text-small">
                      <span><b>{{item.productName}}</b></span><br>
                      <span>{{item.orderProductPrice | priceAppend}} / {{item.productUnit}}</span>
                    </el-col>
                    <el-col :span="6">
                <span
                  class="text-bold padding-left-10">{{(item.orderProductPrice * item.orderProductQuantity) | priceAppend}}</span>
                    </el-col>
                    <el-col :span="9" class="padding-left-10 text-right">
                      <el-button disabled plain size="small" type="warning"
                                 v-if="item.orderProductStatus === 'PREPARING'">
                        <span>Đang chuẩn bị</span>
                      </el-button>
                      <el-button disabled plain size="small" type="success"
                                 v-else-if="item.orderProductStatus === 'SERVED'">
                        <span>Đã phục vụ</span>
                      </el-button>
                      <el-button disabled plain size="small" type="danger" v-else>
                        <span>Đã hủy</span>
                      </el-button>
                    </el-col>
                  </el-row>
                </el-row>
                <el-row v-if="item.orderProductNote" type="flex" align="middle"
                        class="full-size padding-left-10 padding-top-10">
                  <el-tag type="info" size="medium" class="order-note">
                    <el-tooltip :content="item.orderProductNote">
                      <span>Ghi chú: {{item.orderProductNote}}</span>
                    </el-tooltip>
                  </el-tag>
                </el-row>
                <el-row v-if="item.orderProductStatus.includes('CANCELLED')" type="flex" align="middle"
                        class="full-size padding-left-10 padding-top-10">
                  <el-tag type="danger" size="medium" class="order-note">
                    <el-tooltip :content="item.orderProductCancelReason">
                      <span>Lí do hủy: {{item.orderProductCancelReason}}</span>
                    </el-tooltip>
                  </el-tag>
                </el-row>
              </el-card>
            </el-row>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <div slot="footer">
      <el-button @click="hide">
        <span>{{$t("common.entity.action.close")}}</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>

  import CustomerCareOrderService from "@/service/customer-care/customer-care.order.service";
  import RawDataTable from "@/components/raw-table-data/RawDataTable";

  export default {
    name: "CustomerOrderDetailDialog",
    components: {RawDataTable},
    data() {
      return {
        isLoading: false,
        dialogFormVisible: false,
        order: {},
        activities: [],
        listOrderProduct: [],
        orderStatus: {
          CREATED: "Tạo đơn", // Customer create order
          RECEIVED: "Tiếp nhận", // Employee create order or accept order of customer
          PURCHASED: "Thanh toán",
          CANCELLED_BY_EMPLOYEE: "Hủy đơn",
          CANCELLED_BY_CUSTOMER: "Hủy đơn",
          CANCELLED_BY_SYSTEM: "Hủy đơn",
          // additional status
          UPDATE_ORDER: "Gọi món",
          CHANGE_SEAT: "Chuyển bàn",
          CHANGE_PHONE: "Cập nhật SĐT",
          APPLY_VOUCHER: "Sử dụng mã khuyến mãi",
          CANCEL_VOUCHER: "Hủy mã khuyến mãi",
        },
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
              CANCELLED_BY_EMPLOYEE: {label: "Đã hủy", color: "danger"},
              CANCELLED_BY_CUSTOMER: {label: "Hủy bởi khách", color: "danger"},
              CANCELLED_BY_SYSTEM: {label: "Hủy bởi hệ thống", color: "danger"},
            }
          },
          orderCheckinTime: {label: "Giờ vào", display: true, type: "time"},
          orderCheckoutTime: {label: "Giờ ra", display: true, type: "time"},
          customerPhone: {label: "SĐT khách", display: true},
          cashierLogin: {label: "Thu ngân", display: true},
          orderDiscount: {label: "Giảm giá", display: false},
          orderDiscountType: {
            label: "Loại giảm giá", display: false,
            type: "enum",
            enum: {
              VALUE: {label: "Giá trị", color: "primary"},
              PERCENT: {label: "Phần trăm", color: "primary"},
            }
          },
          totalAmount: {label: "Tổng đơn", display: false},
          orderNote: {label: "Ghi chú", display: false},
          orderCancelReason: {label: "Lí do hủy", display: false},
        }
      };
    },
    methods: {
      async show(orderGuid) {
        this.dialogFormVisible = true;
        const {data} = await CustomerCareOrderService.getOrderInfo(orderGuid);
        this.order = data;
        this.listOrderProduct = data.listOrderProduct;
        this.parseHistory(data.orderStatusTimeline);
      },
      parseHistory(history) {
        let events = history.split(";");
        this.activities = [];
        events.forEach(e => {
          let arr = e.split("@");
          let metaData = null;
          if (arr[3]) {
            if (arr[0] === "CHANGE_SEAT") {
              let seats = arr[3].split("*");
              const fromSeat = this.allSeats[seats[0]];
              const toSeat = this.allSeats[seats[1]];
              metaData = "Chuyển từ " + fromSeat.seatName + " - " + fromSeat.areaName;
              metaData += " tới " + toSeat.seatName + " - " + toSeat.areaName;
            }
            if (arr[0] === "CHANGE_PHONE") {
              if (arr[3] === 'null' || !arr[3]) metaData = "";
              else metaData = arr[3];
            }
            if (arr[0] === "UPDATE_ORDER") {
              let temp = arr[3].split("*");
              metaData = temp[0] + " sản phẩm.";
            }
          }
          let activity = {
            action: arr[0],
            actor: arr[1],
            timestamp: this.$moment(arr[2]).format("HH:mm:ss - DD/MM/YYYY"),
            metaData: metaData
          };
          this.activities.push(activity);
        });
      },
      hide() {
        this.dialogFormVisible = false;
      },
      beforeClose(done) {
        done();
      },
    }
  };
</script>

<style scoped>

</style>
