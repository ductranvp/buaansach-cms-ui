<template>
  <el-container class="full-size">
    <el-row class="full-size" type="flex" align="middle" justify="center">
      <el-col :xs="18" :sm="12" :md="6">
        <el-form
          ref="loginForm"
          class="full-size"
          :model="loginForm"
          :rules="loginRules"
        >
          <el-form-item prop="login" label="Username">
            <el-input
              ref="login"
              v-model="loginForm.login"
              prefix-icon="el-icon-user"
              type="text"
            />
          </el-form-item>
          <el-form-item prop="password" label="Password">
            <el-input
              ref="password"
              v-model="loginForm.password"
              prefix-icon="el-icon-lock"
              :type="passwordType"
              @keyup.enter.native="handleLogin"
            >
              <el-button
                slot="append"
                :class="passwordType === '' ? 'show-password-btn' : ''"
                icon="el-icon-view"
                @click="showPassword"
              />
            </el-input>
          </el-form-item>
          <el-form-item prop="rememberMe">
            <el-checkbox v-model="loginForm.rememberMe" class="full-width">
              Remember Me
            </el-checkbox>
            <!--            <el-switch-->
            <!--              v-model="loginForm.rememberMe"-->
            <!--              style="display: block"-->
            <!--              active-color="#13ce66"-->
            <!--              active-text="Remember Me"-->
            <!--            />-->
          </el-form-item>
          <el-form-item>
            <div>
              <el-button
                :loading="loading"
                type="primary"
                style="width: 100%"
                @click="handleLogin"
              >
                Login
              </el-button>
            </div>
          </el-form-item>
          <el-form-item>
            <div>
              <el-button type="info" style="width: 100%" @click="goToHomepage">
                Go to Homepage
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
            message: "Please enter username",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "Please enter password",
            trigger: "blur"
          }
        ]
      },
      loading: false,
      passwordType: "password"
    };
  },
  mounted() {
    if (this.loginForm.login === "") {
      this.$refs.login.focus();
    } else {
      this.$refs.password.focus();
    }
  },
  methods: {
    showPassword() {
      this.passwordType === ""
        ? (this.passwordType = "password")
        : (this.passwordType = "");
    },
    goToHomepage() {
      this.$router.push({ name: "HomePage" });
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              if (sessionStorage.getItem("requested-url")) {
                const item = sessionStorage.getItem("requested-url");
                sessionStorage.removeItem("requested-url");
                this.$router.push({ path: item });
              } else {
                this.$router.push({ path: AppUtils.redirectBasedOnRole() });
              }
              this.loading = false;
            })
            .catch(error => {
              if (error.status === 401)
                NotificationUtils.error("Incorrect username or password!");
              else NotificationUtils.error(error.message || error.data.message);
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.show-password-btn {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  color: #fff !important;
  background-color: #ddd !important;
  border-color: #ddd !important;
}
</style>
