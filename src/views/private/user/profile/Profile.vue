<template>
  <el-row :gutter="20" class="padding-20">
    <el-col :span="6" :xs="24" class="margin-bottom-20">
      <user-card :user="user" />
    </el-col>
    <el-col :span="18" :xs="24">
      <el-card shadow="never">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="Activity" name="activity">
            <activity />
          </el-tab-pane>
          <el-tab-pane label="Information" name="info">
            <information />
          </el-tab-pane>
          <el-tab-pane label="Change Password" name="password">
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
    console.log(this.$store.getters.info);
  }
};
</script>

<style scoped></style>
