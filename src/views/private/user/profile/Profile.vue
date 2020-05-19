<template>
  <el-row :gutter="20" class="padding-20">
    <el-col :span="6" :xs="24" class="margin-bottom-20">
      <user-card :user="user" />
    </el-col>
    <el-col :span="18" :xs="24">
      <el-card shadow="never">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="Hoạt động" name="activity">
            <activity />
          </el-tab-pane>
          <el-tab-pane label="Cập nhật" name="info">
            <information />
          </el-tab-pane>
          <el-tab-pane label="Đổi mật khẩu" name="password">
            <change-password />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from "vuex";
import UserCard from "@/views/private/user/profile/components/UserCard";
import Activity from "@/views/private/user/profile/components/Activity";
import Information from "@/views/private/user/profile/components/Information";
import ChangePassword from "@/views/private/user/profile/components/ChangePassword";

export default {
  name: "User",
  components: { ChangePassword, Information, Activity, UserCard },
  computed: {
    ...mapGetters({
      user: "info"
    })
  },
  data() {
    return {
      activeTab: "activity"
    };
  },
  created() {
  }
};
</script>

<style scoped></style>
