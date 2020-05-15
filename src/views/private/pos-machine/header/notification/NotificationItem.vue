<template>
  <el-row style="line-height: 24px; border-bottom: 1px solid #ddd" type="flex" align="middle"
          class="padding-5-10" :class="data.status === 'UNSEEN' ? 'unseen-notification' : ''">
    <el-col>
      <div>
        <b>{{data.content}}</b>
      </div>
      <div>
        <el-tag size="mini" type="info">{{data.time | moment("HH:mm")}}</el-tag>
        <el-tag class="margin-left-10" v-if="data.status === 'UNSEEN'" size="mini" type="info">Chưa xem</el-tag>
        <el-tag class="margin-left-10" v-else size="mini" type="info">Đã xem</el-tag>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: "NotificationItem",
    props: {
      data: Object
    },
    methods: {}
  };
</script>

<style scoped>
  .unseen-notification {
    background-color: #ddd;
  }
</style>
