<template>
  <el-card shadow="never" style="line-height: 1.5">
    <div slot="header">
      <span>Tài khoản</span>
    </div>
    <el-container direction="vertical">
      <el-row type="flex" justify="center">
        <avatar :user="user" class="text-center" :show-tooltip="false"/>
      </el-row>
      <el-row type="flex" justify="center" class="padding-top-10">
        <span class="user-name">{{ user.fullName }}</span>
      </el-row>
      <el-divider class="margin-15-0"/>
      <el-row>
        <div>
          <span>Ngày tạo: {{ user.createdDate | moment('HH:mm - DD/MM/YYYY') }}</span>
        </div>
        <div>
          <span>Ngày sửa cuối: {{ user.lastModifiedDate | moment('HH:mm - DD/MM/YYYY') }}</span>
        </div>
      </el-row>
    </el-container>
  </el-card>
</template>

<script>
  import Avatar from '@/components/user-avatar/UserAvatar';

  export default {
    name: 'UserCard',
    components: {Avatar},
    props: {
      user: Object,
    },
  };
</script>

<style scoped>
  .user-name {
    font-weight: bold;
  }
</style>
