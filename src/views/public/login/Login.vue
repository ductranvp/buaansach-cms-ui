<template>
  <el-container class="full-size login-container bg-success">
    <el-row class="full-size" type="flex" align="middle" justify="center">
      <el-col :xs="18" :sm="16" :md="12" :lg="8" :xl="8">
        <el-form ref="loginForm" class="full-size" :model="loginForm" :rules="loginRules">
          <el-form-item prop="login">
            <InputLabel effect="dark" :label="$t('public.loginPage.loginForm.username')"
                        required/>
            <el-input ref="login" v-model="loginForm.login" prefix-icon="el-icon-user" type="text"/>
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
          <el-form-item>
            <el-alert style="line-height: 24px" type="error" :closable="false">
              <span slot="title">Lưu ý:</span>
              <span>Không lưu mật khẩu nếu dùng chung máy tính</span>
            </el-alert>
          </el-form-item>
          <!--          <el-form-item prop="rememberMe">-->
          <!--            <el-checkbox v-model="loginForm.rememberMe" class="full-width">-->
          <!--              <span class="text-light">{{ $t("public.loginPage.loginForm.rememberMe") }}</span>-->
          <!--            </el-checkbox>-->
          <!--          </el-form-item>-->
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
  </el-container>
</template>

<script>
  import AppUtils from "@/utils/app.util";
  import NotificationUtils from "@/utils/notification.util";
  import {mapState} from "vuex";

  export default {
    name: "Login",
    data() {
      return {
        loginForm: {
          login: "",
          password: "",
          rememberMe: false
        },
        loginRules: {
          login: [
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
            }
          ]
        },
        isLoading: false
      };
    },
    computed: {
      ...mapState({
        isAuthenticated: state => state.user.isAuthenticated
      })
    },
    mounted() {
      if (this.isAuthenticated) this.$router.push({name: "homePage"});
      if (this.loginForm.login === "") {
        this.$refs.login.focus();
      } else {
        this.$refs.password.focus();
      }
    },
    methods: {
      forgotPassword() {
        this.$router.push({name: "resetPasswordInitPage"});
      },
      handleLogin() {
        const vm = this;
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.isLoading = true;
            this.$store
              .dispatch("user/login", this.loginForm)
              .then(() => {
                const redirect = sessionStorage.getItem("requested-url");
                if (redirect && redirect !== "/home") {
                  const item = sessionStorage.getItem("requested-url");
                  sessionStorage.removeItem("requested-url");
                  this.$router.push({path: item});
                } else {
                  this.$router.push({path: AppUtils.redirectBasedOnRole()});
                }
                this.isLoading = false;
              })
              .catch(error => {
                NotificationUtils.error(error.message || error.data.message);
                this.isLoading = false;
              });
          } else {
            return false;
          }
        });
      }
    }
  };
</script>

<style scoped>
  .login-container {
    min-height: 100%;
    width: 100%;
    /*background-color: #2d3a4b;*/
    overflow: hidden;
  }

</style>
