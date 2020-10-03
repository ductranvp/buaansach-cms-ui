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
          <InputLabel label="Mật khẩu hiện tại" required/>
          <el-input type="password" v-model="form.currentPassword"></el-input>
        </el-form-item>
        <el-form-item prop="newPassword">
          <InputLabel label="Mật khẩu mới" required/>
          <el-input type="password" v-model="form.newPassword"></el-input>
        </el-form-item>
        <el-form-item prop="confirm">
          <InputLabel label="Xác nhận mật khẩu mới" required/>
          <el-input type="password" v-model="form.confirm"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="isLoading"
            @click="submit"
            class="width-100"
            type="success"
          >
            <span>Đổi mật khẩu</span>
          </el-button>
        </el-form-item>
      </el-form>
    </el-form>
  </el-row>
</template>

<script>
  import UserService from "@/service/shared/user.service";
  import MessageUtils from "@/utils/message.util";

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
              message: this.$t("common.entity.validation.required"),
              trigger: "blur"
            }
          ],
          newPassword: [
            {
              required: true,
              message: this.$t("common.entity.validation.required"),
              trigger: "blur"
            }
          ],
          confirm: [
            {
              required: true,
              message: this.$t("common.entity.validation.required"),
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
              MessageUtils.error("Nhập lại mật khẩu không khớp");
            else {
              vm.isLoading = true;
              UserService.changePassword(vm.form)
                .then(() => {
                  MessageUtils.success("Đổi mật khẩu thành công");
                  vm.isLoading = false;
                  vm.resetForm();
                })
                .catch(error => {
                  MessageUtils.error(error.data.message || error.message);
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
