<template>
  <el-container class="full-size bg-success">
    <el-header height="auto"></el-header>
    <el-main class="full-size">
      <el-row class="full-size" type="flex" align="middle" justify="center">
        <el-col :xs="18" :sm="16" :md="12" :lg="8" :xl="8">
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
            <el-form-item prop="principal">
              <InputLabel effect="dark" :label="$t('public.loginPage.loginForm.username')"
                          required/>
              <el-input
                      ref="principal"
                      v-model="loginForm.principal"
                      prefix-icon="el-icon-user"
                      type="text"
                      @keyup.enter.native="handleLogin"
              />
            </el-form-item>
            <el-form-item prop="password">
              <InputLabel effect="dark" :label="$t('public.loginPage.loginForm.password')"
                          required/>
              <el-input
                      ref="password"
                      v-model="loginForm.password"
                      prefix-icon="el-icon-lock"
                      type="password"
                      @keyup.enter.native="handleLogin"
              ></el-input>
            </el-form-item>
            <el-form-item prop="rememberMe">
              <el-checkbox v-model="loginForm.rememberMe" class="full-width">
                <span class="text-light">{{ $t('public.loginPage.loginForm.rememberMe') }}</span>
              </el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-alert style="line-height: 24px" type="error" :closable="false">
                <span slot="title">Lưu ý:</span>
                <div>Không lưu mật khẩu nếu dùng chung máy tính</div>
                <div>Mỗi lần đăng nhập sẽ có hiệu lực trong 24 giờ</div>
              </el-alert>
            </el-form-item>
            <el-form-item>
              <div>
                <el-button
                        :loading="isLoading"
                        type="warning"
                        style="width: 100%"
                        @click="handleLogin"
                >
                  <span>{{ $t("public.loginPage.loginForm.loginBtn") }}</span>
                </el-button>
              </div>
            </el-form-item>
            <el-form-item>
              <div>
                <el-button type="info" style="width: 100%" @click="forgotPassword">
                  <span>{{ $t("public.loginPage.loginForm.forgotBtn") }}</span>
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
  import AppUtils from '@/utils/app.util';
  import StorageKey from '@/utils/storage-key';
  import MessageUtils from '@/utils/message.util';
  import ErrorUtils from '@/utils/error.util';

  export default {
    name: "Login",
    data() {
      return {
        loginForm: {
          principal: "",
          password: "",
          rememberMe: true
        },
        loginRules: {
          principal: [
            {
              required: true,
              message: this.$t("common.entity.validation.required"),
              trigger: "blur"
            }
          ],
          password: [
            {
              required: true,
              message: this.$t("common.entity.validation.required"),
              trigger: "blur"
            },
            {min: 4, message: this.$t("common.entity.validation.minlength", {min: 4}), trigger: "blur"},
            {max: 100, message: this.$t("common.entity.validation.maxlength", {max: 100}), trigger: "blur"},
          ]
        },
        isLoading: false
      };
    },
    mounted() {
      if (this.isAuthenticated) this.$router.push({name: "homePage"});
      if (this.loginForm.principal === "") {
        this.$refs.principal.focus();
      } else {
        this.$refs.password.focus();
      }
    },
    methods: {
      forgotPassword() {
        this.$router.push({name: "resetPasswordInitPage"});
      },
      handleLogin() {
        this.$refs.loginForm.validate(async valid => {
          if (valid) {
            this.isLoading = true;
            try {
              await this.$store.dispatch("user/login", this.loginForm);
              this.redirect();
            } catch (error) {
              await this.$store.dispatch("user/logout");
              let stringMessage = AppUtils.getStringErrorCode(error);
              if (stringMessage.toLowerCase().includes("bad credentials")) {
                MessageUtils.error("Sai thông tin đăng nhập");
              } else {
                const defaultMessage = "Đăng nhập không thành công, vui lòng thử lại sau";
                ErrorUtils.showErrorMessage(error, defaultMessage);
              }
              this.isLoading = false;
            }
          } else {
            return false;
          }
        });
      },
      redirect() {
        const redirect = sessionStorage.getItem(StorageKey.sessionStorageKeys.REQUESTED_URL);
        if (redirect && redirect !== "/home") {
          sessionStorage.removeItem(StorageKey.sessionStorageKeys.REQUESTED_URL);
          this.$router.push({path: redirect});
        } else {
          this.$router.push({path: AppUtils.redirectBasedOnRole()});
        }
      }
    }
  };
</script>

<style scoped>

</style>
