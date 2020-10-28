<template>
  <div>
    <div class="text-dark">
      <b>{{notification.title}}</b>
      <em> ({{notification.orderNotification.numberOfProduct }} loại sản phẩm)</em>
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
      </el-col>

      <template v-if="!showFullInfo">
        <el-tooltip placement="top" v-if="notification.firstSeenBy">
          <div slot="content">
            <span>Người xem đầu: {{notification.firstSeenBy}}</span>
          </div>
          <el-tag class="margin-left-10" size="small" type="info">
            <i class="fas el-icon-fa-eye margin-0"></i>
          </el-tag>
        </el-tooltip>
        <el-tooltip placement="top" v-if="notification.storeNotificationHidden && notification.firstHiddenBy">
          <div slot="content">
            <span>Người ẩn đầu: {{notification.firstHiddenBy}}</span>
          </div>
          <el-tag class="margin-left-10" size="small" type="info">
            <i class="fas el-icon-fa-eye-slash margin-0"></i>
          </el-tag>
        </el-tooltip>
      </template>

      <template v-else>
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
  </div>
</template>

<script>
  export default {
    name: 'OrderUpdateItem',
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
  };
</script>

<style scoped>

</style>