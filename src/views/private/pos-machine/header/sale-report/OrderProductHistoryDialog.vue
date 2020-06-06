<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    title="Lịch sử thao tác"
    :before-close="beforeClose"
    :destroy-on-close="true"
    :append-to-body="true"
    width="50%"
  >
    <el-main>
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.timestamp"
          placement="top">
          <el-card shadow="never" :body-style="{padding: '10px'}">
            <p><b>{{orderProductStatus[activity.action]}}</b></p>
            <p v-if="activity.action === 'PREPARING'" class="text-warning">
              <em>Lưu ý: Khách gọi món hoặc nhân viên tạo đều tự động chuyển sang trạng thái Đang chuẩn bị</em>
            </p>
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

  export default {
    name: "OrderProductHistoryDialog",
    data() {
      return {
        dialogFormVisible: false,
        activities: [],
        orderProductStatus: {
          CREATED: "Đã tạo",
          PREPARING: "Đang chuẩn bị",
          SERVED: "Đã phục vụ",
          CANCELLED_BY_EMPLOYEE: "Hủy món",
          CANCELLED_BY_CUSTOMER: "Hủy bởi khách",
          CANCELLED_BY_SYSTEM: "Hủy bởi hệ thống",
        }
      };
    },
    methods: {
      async show(orderProduct) {
        this.dialogFormVisible = true;
        this.parseHistory(orderProduct.orderProductStatusTimeline);
      },
      parseHistory(history) {
        let events = history.split(";");

        this.activities = [];
        events.forEach(e => {
          let arr = e.split("@");
          let activity = {
            action: arr[0],
            actor: arr[1],
            timestamp: this.$moment(arr[2]).format("HH:mm:ss - DD/MM/YYYY"),
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
