<template>
  <el-container class="full-size reset-container bg-success">
    <el-row class="full-size" type="flex" align="middle" justify="center">
      <el-col :xs="18" :sm="16" :md="12" :lg="8" :xl="8">
        <el-form ref="resetPasswordForm" :model="form" :rules="formRules">
          <el-form-item prop="email">
            <input-label effect="dark" :label="$t('public.resetPasswordInitPage.inputLabel')" required/>
            <el-input v-model="form.email"/>
          </el-form-item>
          <el-form-item>
            <div>
              <el-button
                :loading="isLoading"
                type="warning"
                style="width: 100%"
                @click="submit"
              >
                <span>{{ $t("public.resetPasswordInitPage.submitBtn") }}</span>
              </el-button>
            </div>
          </el-form-item>
          <el-form-item>
            <div>
              <el-button type="info" style="width: 100%" @click="()=> {this.$router.push('/login')}">
                <span>{{ $t("public.resetPasswordInitPage.loginBtn") }}</span>
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
  import UserService from "@/service/shared/user.service";
  import MessageBoxUtils from "@/utils/message-box.util";
  import Constants from '@/utils/constants';
  import ErrorUtils from '@/utils/error.util';

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
        vm.$refs.resetPasswordForm.validate(async valid => {
          if (valid) {
            try {
              vm.isLoading = true;
              await UserService.resetPasswordInit({
                email: vm.form.email,
                domainType: Constants.CMS_UI_DOMAIN
              });
              MessageBoxUtils.showAlert("Thành công!", "Kiểm tra thư điện tử để đặt lại mật khẩu", false, function () {
                vm.$router.push({name: 'loginPage'});
              });
            } catch (error) {
              ErrorUtils.showErrorMessage(error);
            } finally {
              vm.isLoading = false;
            }
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
