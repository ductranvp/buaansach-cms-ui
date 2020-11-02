<template>
  <div>
    <div>
      <b>{{notification.title}}</b>
      <em> ({{paymentMethod[notification.payRequestNotification.storePayRequestMethod]}})</em>
    </div>
    <el-row type="flex" align="middle">
      <el-col>
        <!--Timestamp-->
        <el-tooltip placement="top">
          <div slot="content">
            <span>{{notification.createdDate | moment('HH:mm:ss - DD/MM/YYYY')}}</span>
          </div>
          <el-tag size="small" type="info">
            <i class="el-icon-time"></i>
            <span>{{notification.createdDate | moment('HH:mm:ss')}}</span>
          </el-tag>
        </el-tooltip>

        <!--Created by-->
        <el-tooltip placement="top" v-if="showFullInfo">
          <div slot="content">
            <span>Người gọi: </span>
            <span v-if="notification.createdBy === 'anonymousUser'">Ẩn danh</span>
            <span v-else>{{notification.createdBy}}</span>
          </div>
          <el-tag class="margin-left-10" size="small" type="info">
            <i class="el-icon-user-solid"></i>
            <span v-if="notification.createdBy === 'anonymousUser'">Ẩn danh</span>
            <span v-else>{{notification.createdBy}}</span>
          </el-tag>
        </el-tooltip>

        <!--Payment-->
        <el-tooltip placement="top" content="Tiền khách sẽ đưa">
          <el-tag class="margin-left-10" size="small" type="success" effect="dark">
            <i class="el-icon-money"></i>
            <span class="text-small">{{notification.payRequestNotification.storePayRequestAmount | priceAppend}}</span>
          </el-tag>
        </el-tooltip>
      </el-col>

      <template v-if="showFullInfo">
        <el-tooltip placement="top" v-if="notification.firstSeenBy" content="Người xem đầu">
          <el-tag class="margin-left-10" size="small" type="info">
            <i class="fas el-icon-fa-eye"></i>
            <span>{{notification.firstSeenBy}}</span>
          </el-tag>
        </el-tooltip>
        <el-tooltip placement="top" v-if="notification.storeNotificationHidden && notification.firstHiddenBy"
                    content="Người ẩn đầu">
          <el-tag class="margin-left-10" size="small" type="info">
            <i class="fas el-icon-fa-eye-slash"></i>
            <span>{{notification.firstHiddenBy}}</span>
          </el-tag>
        </el-tooltip>
      </template>

    </el-row>
    <div v-if="notification.payRequestNotification.keepTheChange">
      <span class="text-bold text-danger">Khách không lấy tiền thừa</span>
    </div>
  </div>
</template>

<script>
  import PaymentMethod from '@/enum/PaymentMethod';

  export default {
    name: 'PayRequestItem',
    props: {
      showFullInfo: {
        type: Boolean,
        default: false,
      },
      notification: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        paymentMethod: PaymentMethod.label,
      };
    },
  };
</script>

<style scoped>

</style>