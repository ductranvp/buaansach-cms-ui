<template>
  <el-header>
    <el-row
      type="flex"
      class="full-size"
      justify="space-between"
      align="middle"
    >
      <el-col :span="8">
        <el-button
          class="transparent-btn"
          @click="
            () => {
              this.$router.push('/');
            }
          "
          >Bữa Ăn Sạch
        </el-button>
      </el-col>
      <el-col class="hidden-sm-and-down" :span="8">
        <el-input placeholder="Search">
          <el-button slot="append" icon="el-icon-search" />
        </el-input>
      </el-col>
      <el-col :span="8">
        <el-row
          type="flex"
          justify="end"
          class="padding-right-20"
          align="middle"
        >
          <div
            class="padding-right-20"
            @click="
              () => {
                this.$router.push('/order');
              }
            "
          >
            <el-button class="transparent-btn">Order</el-button>
          </div>
          <div class="padding-right-20">
            <el-dropdown trigger="click" @command="changeLanguage">
              <span class="el-dropdown-link">
                <!--                {{ $t("public.header.language")-->
                <!--                }}-->
                <span v-if="currentLanguage === 'vi'">
                  <span class="flag-icon flag-icon-vn margin-right-10"></span>
                  <span>Tiếng Việt</span>
                </span>
                <span v-if="currentLanguage === 'en'">
                  <span class="flag-icon flag-icon-us margin-right-10"></span>
                  <span>English</span>
                </span>
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  command="vi"
                  :class="currentLanguage === 'vi' ? 'active-language' : ''"
                >
                  <span class="flag-icon flag-icon-vn margin-right-10"></span>
                  <span>Tiếng Việt</span>
                </el-dropdown-item>
                <el-dropdown-item
                  command="en"
                  :class="currentLanguage === 'en' ? 'active-language' : ''"
                >
                  <span class="flag-icon flag-icon-us margin-right-10"></span>
                  <span>English</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div>
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="el-dropdown-link">
                Menu<i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="aboutPage"
                  >About Us
                </el-dropdown-item>
                <el-dropdown-item command="contactPage"
                  >Contact Us
                </el-dropdown-item>
                <el-dropdown-item command="productPage"
                  >Product
                </el-dropdown-item>
                <el-dropdown-item command="salePage">Sale</el-dropdown-item>
                <el-dropdown-item
                  v-if="!isAuthenticated"
                  command="loginPage"
                  divided
                  >Login
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="hasAnyRole(['ROLE_ADMIN'])"
                  command="adminDashboardPage"
                  divided
                  >{{ $t("admin.title") }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="hasAnyRole(['ROLE_MANAGER'])"
                  command="managerDashboardPage"
                  >{{ $t("manager.title") }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="hasAnyRole(['ROLE_EMPLOYEE'])"
                  command="employeeDashboardPage"
                  >{{ $t("employee.title") }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="hasAnyRole(['ROLE_USER'])"
                  command="profilePage"
                  divided
                  >{{ $t("user.profile.menuTitle") }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="isAuthenticated"
                  command="logout"
                  divided
                  >Logout
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-row>
      </el-col>
    </el-row>
  </el-header>
</template>

<script>
import AuthUtils from "@/utils/auth.util";
import { mapState } from "vuex";
import hasAnyRole from "@/utils/has-any-role";
import i18n from "@/i18n";
import AppUtils from "@/utils/app.util";

export default {
  name: "PublicHeader",
  computed: {
    ...mapState({
      isAuthenticated: state => state.user.isAuthenticated,
      currentLanguage: state => state.translation.currentLanguage,
      languages: state => state.translation.languages
    })
  },
  methods: {
    hasAnyRole,
    handleCommand(value) {
      if (value === "logout") {
        AuthUtils.logout();
      } else {
        this.$router.push({ name: value });
      }
    },
    changeLanguage(lang) {
      i18n.changeLanguage(lang);
      document.title = AppUtils.generatePageTitle(this.$route.meta.title);
    }
  }
};
</script>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.el-dropdown-menu {
  padding: 0;
}

.active-language {
  background: #bdeffb;
}
</style>
