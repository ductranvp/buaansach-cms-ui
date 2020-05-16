<template>
  <el-container class="full-size reset-container bg-success">
    <el-row class="full-size" type="flex" justify="center" align="middle">
      <el-col :xs="18" :sm="16" :md="12" :lg="8" :xl="8">
        <el-form ref="resetPasswordForm" :model="form" :rules="formRules">
          <el-form-item prop="newPassword">
            <input-label effect="dark" :label="$t('public.resetPasswordFinishPage.newPasswordLabel')" required/>
            <el-input v-model="form.newPassword" type="password" show-password/>
          </el-form-item>
          <el-form-item prop="confirm">
            <input-label effect="dark" :label="$t('public.resetPasswordFinishPage.confirmLabel')" required/>
            <el-input v-model="form.confirm" type="password" show-password/>
          </el-form-item>
          <el-form-item>
            <div>
              <el-button
                :loading="isLoading"
                type="warning"
                style="width: 100%"
                @click="submit"
              >
                <span>{{ $t("public.resetPasswordFinishPage.submitBtn") }}</span>
              </el-button>
            </div>
          </el-form-item>
          <el-form-item>
            <div>
              <el-button style="width: 100%" type="info" @click="()=>{this.$router.push('/home')}">Về trang chủ
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
  import AccountService from "@/service/account.service";
  import MessageBoxUtils from "@/utils/message-box.util";
  import NotificationUtils from "@/utils/notification.util";

  export default {
    name: "ResetPasswordFinish",
    data() {
      return {
        isLoading: false,
        form: {
          key: null,
          newPassword: null,
          confirm: null
        },
        formRules: {
          newPassword: [
            {
              required: true,
              message: this.$t("common.entity.validation.required"),
              trigger: "blur"
            },
            {
              max: 100,
              message: this.$t("common.entity.validation.maxlength", {
                max: 100
              }),
              trigger: "blur"
            },
            {
              min: 4,
              message: this.$t("common.entity.validation.minlength", {
                min: 4
              }),
              trigger: "blur"
            }
          ],
          confirm: [
            {
              required: true,
              message: this.$t("common.entity.validation.required"),
              trigger: "blur"
            },
            {
              max: 100,
              message: this.$t("common.entity.validation.maxlength", {
                max: 100
              }),
              trigger: "blur"
            },
            {
              min: 4,
              message: this.$t("common.entity.validation.minlength", {
                min: 4
              }),
              trigger: "blur"
            }
          ]
        }
      };
    },
    methods: {
      submit() {
        const vm = this;
        vm.$refs.resetPasswordForm.validate(valid => {
          if (valid) {
            if (vm.form.confirm !== vm.form.newPassword) {
              NotificationUtils.error(vm.$t("public.resetPasswordFinishPage.passwordNotMatch"));
              return false;
            }
            vm.form.key = vm.$route.params.key;
            AccountService.resetPasswordFinish(vm.form).then(function () {
              MessageBoxUtils.showAlert(vm.$t("public.resetPasswordFinishPage.alertTitle"),
                vm.$t("public.resetPasswordFinishPage.alertMessage"), false, function () {
                  vm.$router.push({name: 'loginPage'});
                });
            }).catch(error => {
              const message = error.message || error.data.message;
              NotificationUtils.error(message);
            });
          }
        });
      }
    }
  };
</script>

<style scoped>
  .reset-container {
    min-height: 100%;
    width: 100%;
    background-color: #2d3a4b;
    overflow: hidden;
  }
</style>
