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
          <el-form-item prop="login">
            <InputLabel
              :label="$t('public.loginPage.loginForm.username')"
              required
            />
            <el-input
              ref="login"
              v-model="loginForm.login"
              prefix-icon="el-icon-user"
              type="text"
            />
          </el-form-item>
          <el-form-item prop="password">
            <InputLabel
              :label="$t('public.loginPage.loginForm.password')"
              required
            />
            <el-input
              ref="password"
              v-model="loginForm.password"
              prefix-icon="el-icon-lock"
              :type="passwordType"
              @keyup.enter.native="handleLogin"
            >
              <el-tooltip
                slot="append"
                effect="dark"
                :content="showPasswordTooltip"
                placement="bottom-end"
              >
                <el-button
                  :class="passwordType === '' ? 'show-password-btn' : ''"
                  icon="el-icon-view"
                  @click="showPassword"
                />
              </el-tooltip>
            </el-input>
          </el-form-item>
          <el-form-item prop="rememberMe">
            <el-checkbox v-model="loginForm.rememberMe" class="full-width">
              <span>{{ $t("public.loginPage.loginForm.rememberMe") }}</span>
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <div>
              <el-button
                :loading="loading"
                type="primary"
                style="width: 100%"
                @click="handleLogin"
              >
                <span>{{ $t("public.loginPage.loginForm.loginBtn") }}</span>
              </el-button>
            </div>
          </el-form-item>
          <el-form-item>
            <div>
              <el-button
                type="info"
                style="width: 100%"
                @click="forgotPassword">
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
            message: this.$t("public.loginPage.loginForm.validateUsername"),
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: this.$t("public.loginPage.loginForm.validatePassword"),
            trigger: "blur"
          }
        ]
      },
      loading: false,
      passwordType: "password"
    };
  },
  computed: {
    ...mapState({
      isAuthenticated: state => state.user.isAuthenticated
    }),
    showPasswordTooltip() {
      if (this.passwordType === "password") {
        return this.$t("public.loginPage.loginForm.showPassword");
      } else {
        return this.$t("public.loginPage.loginForm.hidePassword");
      }
    }
  },
  mounted() {
    if (this.isAuthenticated) this.$router.push({name: 'homePage'});
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
    forgotPassword() {
      this.$router.push({ name: "resetPasswordInitPage" });
    },
    handleLogin() {
      const vm = this;
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
                NotificationUtils.error(vm.$t("public.loginPage.error.badCredential"));
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
