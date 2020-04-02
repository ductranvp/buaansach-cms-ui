<template>
  <el-container class="full-size">
    <el-row class="full-size" type="flex" align="middle" justify="center">
      <el-col :xs="18" :sm="12" :md="6">
        <el-form ref="resetPasswordForm" :model="form" :rules="formRules">
          <el-form-item prop="email">
            <input-label :label="$t('public.resetPasswordInitPage.inputLabel')" required/>
            <el-input v-model="form.email"/>
          </el-form-item>
          <el-form-item>
            <div>
              <el-button
                :loading="isLoading"
                type="primary"
                style="width: 100%"
                @click="submit"
              >
                <span>{{ $t("public.resetPasswordInitPage.submitBtn") }}</span>
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

  export default {
    name: "ResetPasswordInit",
    data() {
      return {
        isLoading: false,
        form: {
          email: null,
        },
        formRules: {
          email: [
            {
              required: true,
              message: this.$t("common.entity.validation.required"),
              trigger: "blur"
            },
            {
              type: 'email',
              message: this.$t("common.entity.validation.email"),
              trigger: "blur"
            },
          ]
        }
      };
    },
    methods: {
      submit() {
        const vm = this;
        vm.$refs.resetPasswordForm.validate(valid => {
          if (valid) {
            AccountService.resetPasswordInit(vm.form.email).then(function () {
              MessageBoxUtils.showAlert(vm.$t("public.resetPasswordInitPage.alertTitle"),
                vm.$t("public.resetPasswordInitPage.alertMessage"), false, function () {
                  vm.$router.push({name: 'loginPage'});
                });
            });
          }
        });
      }
    }
  };
</script>

<style scoped></style>
