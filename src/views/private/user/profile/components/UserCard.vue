<template>
  <el-card shadow="never" style="line-height: 1.5">
    <div slot="header">
      <span>About</span>
    </div>
    <el-container direction="vertical">
      <el-row type="flex" justify="center">
        <avatar :user="user" class="text-center" :show-tooltip="false" />
      </el-row>
      <el-row type="flex" justify="center" class="padding-top-10">
        <span class="user-name">{{ user.firstName }} {{ user.lastName }}</span>
      </el-row>
      <el-divider class="margin-15-0" />
      <el-row>
        <div>
          <span>Email: {{ user.email }}</span>
        </div>
        <div>
          <span>Phone: {{ user.phone }}</span>
        </div>
      </el-row>
    </el-container>
  </el-card>
</template>

<script>
import Avatar from "@/components/user-avatar/index";
export default {
  name: "UserCard",
  components: { Avatar },
  props: {
    user: Object
  }
};
</script>

<style scoped>
.user-name {
  font-weight: bold;
}
</style>
