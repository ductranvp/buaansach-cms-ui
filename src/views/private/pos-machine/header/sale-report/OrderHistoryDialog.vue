<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    :title="'Đơn hàng: ' + order.orderCode"
    :before-close="beforeClose"
    :destroy-on-close="true"
    :append-to-body="true"
    width="80%"
  >
    <el-main v-loading="isLoading">
      <el-row type="flex" align="top" v-if="!isLoading">
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
                    <el-button @click="showOrderProductHistory(item)" size="small" class="margin-top-10">
                      <span>Lịch sử</span>
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
    <div slot="footer">
      <el-button @click="hide">
        <span>{{$t("common.entity.action.close")}}</span>
      </el-button>
    </div>
    <order-product-history-dialog ref="orderProductHistoryDialog" />
  </el-dialog>
</template>

<script>

  import {mapState} from "vuex";
  import PosOrderProductService from "@/service/pos/pos.order-product.service";
  import MessageUtils from "@/utils/message.util";
  import OrderProductHistoryDialog from "@/views/private/pos-machine/header/sale-report/OrderProductHistoryDialog";

  export default {
    name: "OrderHistoryDialog",
    components: {OrderProductHistoryDialog},
    props: {
      currentStoreUserRole: String,
    },
    computed: {
      ...mapState({
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
        }
      };
    },
    methods: {
      resetData(){
        this.order = {};
        this.listOrderProduct = [];
      },
      async show(order) {
        this.resetData();
        this.order = order;
        this.dialogFormVisible = true;
        this.isLoading = true;
        try {
          const {data} = await PosOrderProductService.getOrderProductByOrderGuid(order.guid);
          this.listOrderProduct = data;
          this.parseHistory(order.orderStatusTimeline);
        } catch (e) {
          MessageUtils.error("Lỗi tải dữ liệu, vui lòng thử lại sau!");
        }
        this.isLoading = false;
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
            if (arr[0] === "APPLY_VOUCHER") {
              metaData = arr[3];
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
      showOrderProductHistory(orderProduct) {
        this.$refs.orderProductHistoryDialog.show(orderProduct);
      },
    }
  };
</script>

<style scoped>

</style>
