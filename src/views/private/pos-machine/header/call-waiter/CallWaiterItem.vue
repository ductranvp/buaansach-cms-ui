<template>
  <el-row type="flex" align="middle"
          class="padding-5-10 notification-item"
          :class="notification.status === 'UNSEEN' ? 'unseen-notification' : ''">
    <el-col class="padding-right-10" @click.native="clickNotification(notification)">
      <div>
        <b>{{notification.title}}</b>
      </div>
      <el-row type="flex" align="middle">
        <el-col>
          <el-tooltip placement="top" :content="$moment(notification.createdDate).format('HH:mm:ss - DD/MM/YYYY')">
            <el-tag size="mini" type="info">
              <i class="el-icon-time"></i>
              <span>{{notification.createdDate | moment("HH:mm:ss")}}</span>
            </el-tag>
          </el-tooltip>
        </el-col>
      </el-row>
    </el-col>
    <el-tooltip placement="top" content="Xóa thông báo">
      <el-button @click="deleteNotification(notification)" type="text"
                 class="text-info text-very-large">
        <i class="el-icon-close"></i>
      </el-button>
    </el-tooltip>
  </el-row>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: "CallWaiterItem",
    computed: {
      ...mapState({
        selectedSeat: state => state.posMachine.selectedSeat,
        currentStore: state => state.posMachine.currentStore,
      })
    },
    props: {
      selectable: {
        type: Boolean,
        default: true
      },
      notification: Object
    },
    data() {
      return {
        isLoading: false
      };
    },
    methods: {
      clickNotification(notification) {
        notification.status = "SEEN";
        this.$store.commit("posMachine/SEEN_CALL_WAITER", notification);
      },
      deleteNotification(notification) {
        this.$store.commit("posMachine/REMOVE_CALL_WAITER", notification);
      },
    }
  };
</script>

<style lang="scss" scoped>
  .notification-item {
    line-height: 24px;
    border-bottom: 1px solid #bbb
  }

  .unseen-notification {
    background-color: $--color-warning-light;
  }

  .notification-item i {
    margin-right: 5px;
  }
</style>
