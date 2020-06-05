<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    title=""
    :close-on-click-modal="false"
    :before-close="beforeClose"
    :destroy-on-close="true"
    :append-to-body="true"
  >
    <el-main>
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
    </el-main>
    <div slot="footer">
      <el-button @click="hide">
        <span>{{$t("common.entity.action.close")}}</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>

  import {mapState} from "vuex";

  export default {
    name: "SaleReportHistoryDialog",
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
        isEdit: false,
        isLoading: false,
        dialogFormVisible: false,
        activities: [],
        orderStatus: {
          CREATED: "Tạo đơn", // Customer create order
          RECEIVED: "Tiếp nhận", // Employee create order or accept order of customer
          PURCHASED: "Thanh toán",
          CANCELLED_BY_EMPLOYEE: "Hủy đơn",
          CANCELLED_BY_CUSTOMER: "Hủy đơn",
          CANCELLED_BY_SYSTEM: "Hủy đơn",
          // additional status
          CHANGE_SEAT: "Chuyển bàn",
          CHANGE_PHONE: "Cập nhật SĐT"
        }
      };
    },
    methods: {
      show(data) {
        console.log(data);
        let events = data.split(";");

        this.activities = [];
        events.forEach(e => {
          let arr = e.split("@");
          console.log(arr);

          let metaData = null;
          if (arr[3]) {
            if (arr[0] === "CHANGE_SEAT"){
              let seats = arr[3].split("*");
              const fromSeat = this.allSeats[seats[0]];
              const toSeat = this.allSeats[seats[1]];
              metaData = "Chuyển từ " + fromSeat.seatName + " - " + fromSeat.areaName;
              metaData += " tới " + toSeat.seatName + " - " + toSeat.areaName;
            }
            if (arr[0] === "CHANGE_PHONE"){
              metaData = arr[3];
            }
          }
          console.log(metaData);

          let activity = {
            action: arr[0],
            actor: arr[1],
            timestamp: this.$moment(arr[2]).format("HH:mm:ss DD/MM/YYYY"),
            metaData: metaData
          };
          this.activities.push(activity);
        });
        this.dialogFormVisible = true;
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
