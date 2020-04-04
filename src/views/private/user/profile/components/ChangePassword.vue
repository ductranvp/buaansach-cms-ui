<template>
  <el-row>
    <el-form>
      <el-form
        :inline="false"
        :model="form"
        :rules="rules"
        ref="changePasswordForm"
      >
        <el-form-item prop="currentPassword">
          <InputLabel label="Current password" required />
          <el-input type="password" v-model="form.currentPassword"></el-input>
        </el-form-item>
        <el-form-item prop="newPassword">
          <InputLabel label="New password" required />
          <el-input type="password" v-model="form.newPassword"></el-input>
        </el-form-item>
        <el-form-item prop="confirm">
          <InputLabel label="Confirm new password" required />
          <el-input type="password" v-model="form.confirm"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="isLoading"
            @click="submit"
            class="width-100"
            type="primary"
            >Change password
          </el-button>
        </el-form-item>
      </el-form>
    </el-form>
  </el-row>
</template>

<script>
import NotificationUtils from "@/utils/notification.util";
import AccountService from "@/service/account.service";

export default {
  name: "ChangePassword",
  data() {
    return {
      isLoading: false,
      form: {
        currentPassword: null,
        newPassword: null,
        confirm: null
      },
      rules: {
        currentPassword: [
          {
            required: true,
            message: "Please enter current password",
            trigger: "blur"
          }
        ],
        newPassword: [
          {
            required: true,
            message: "Please enter new password",
            trigger: "blur"
          }
        ],
        confirm: [
          {
            required: true,
            message: "Please enter confirm new password",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    resetForm() {
      this.$refs.changePasswordForm.resetFields();
    },
    submit() {
      let vm = this;
      this.$refs["changePasswordForm"].validate(async valid => {
        if (valid) {
          if (vm.form.newPassword !== vm.form.confirm)
            NotificationUtils.error("Confirm password does not match");
          else {
            vm.isLoading = true;
            AccountService.changePassword(vm.form)
              .then(() => {
                NotificationUtils.success("Change password successfully");
                vm.isLoading = false;
                vm.resetForm();
              })
              .catch(error => {
                NotificationUtils.error(error.data.message || error.message);
                vm.isLoading = false;
                vm.resetForm();
              });
          }
        }
      });
    }
  }
};
</script>

<style scoped></style>
