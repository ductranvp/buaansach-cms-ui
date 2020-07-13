<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    :title="listInvisibleNotification.length + ' thông báo đã bị ẩn'"
    :close-on-click-modal="false"
    :before-close="beforeClose"
    :destroy-on-close="true"
    :show-close="false"
  >
    <el-main>
      <el-row v-if="!listInvisibleNotification.length">
        <el-alert class="padding-20" type="warning" :closable="false">
          <span class="text-large">Chưa có thông báo nào bị ẩn trong ngày hôm nay</span>
        </el-alert>
      </el-row>
      <template v-else>
        <el-row class="notification-item" v-for="item in listInvisibleNotification" :key="item.guid">
          <notification-item :selectable="false" :notification="item"/>
        </el-row>
      </template>
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
  import NotificationItem from "@/views/private/pos-machine/header/notification/NotificationItem";

  export default {
    name: "HiddenNotificationDialog",
    components: {NotificationItem},
    computed: {
      ...mapState({
        listInvisibleNotification: state => state.posMachine.storeNotifications.filter(item => item.hidden),
      })
    },
    data() {
      return {
        isEdit: false,
        isLoading: false,
        dialogFormVisible: false,
      };
    },
    methods: {
      show() {
        this.dialogFormVisible = true;
      },
      hide() {
        this.dialogFormVisible = false;
      },
      beforeClose(done) {
        done();
      }
    }
  };
</script>

<style scoped>
</style>
