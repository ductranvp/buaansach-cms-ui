<template>
  <el-header>
    <el-row
      type="flex"
      class="full-size"
      justify="space-between"
      align="middle">
      <el-col :span="8">
        <el-button
          class="transparent-btn"
          @click="handleCommand('homePage')">
          <span>{{$t("app.pageTitle")}}</span>
        </el-button>
      </el-col>
      <el-col class="hidden-sm-and-down" :span="8">
        <el-input :placeholder="$t('layout.publicHeader.search')">
          <el-button slot="append" icon="el-icon-search" />
        </el-input>
      </el-col>
      <el-col :span="8">
        <el-row
          type="flex"
          justify="end"
          class="padding-right-20"
          align="middle">
          <div
            class="padding-right-20"
            @click="handleCommand('orderPage')">
            <el-button class="transparent-btn">
              {{ $t("layout.publicHeader.order") }}
            </el-button>
          </div>
          <div class="padding-right-20">
            <el-dropdown trigger="click" @command="changeLanguage">
              <span class="el-dropdown-link">
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
                <el-dropdown-item command="vi" :class="currentLanguage === 'vi' ? 'active-language' : ''">
                  <span class="flag-icon flag-icon-vn margin-right-10"></span>
                  <span>Tiếng Việt</span>
                </el-dropdown-item>
                <el-dropdown-item command="en" :class="currentLanguage === 'en' ? 'active-language' : ''">
                  <span class="flag-icon flag-icon-us margin-right-10"></span>
                  <span>English</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div>
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="el-dropdown-link">
                {{ $t("layout.publicHeader.menu") }}
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="aboutPage">
                  {{ $t("layout.publicHeader.about") }}
                </el-dropdown-item>
                <el-dropdown-item command="contactPage">
                  {{ $t("layout.publicHeader.contact") }}
                </el-dropdown-item>
                <el-dropdown-item command="productPage">
                  {{ $t("layout.publicHeader.product") }}
                </el-dropdown-item>
                <el-dropdown-item command="salePage">
                  {{ $t("layout.publicHeader.sale") }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="!isAuthenticated"
                  command="loginPage"
                  divided>
                  {{ $t("layout.publicHeader.login") }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="hasAnyRole(['ROLE_ADMIN'])"
                  command="adminDashboardPage"
                  divided>
                  {{ $t("layout.publicHeader.admin") }}
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="hasAnyRole(['ROLE_USER'])"
                  command="userDashboardPage"
                  divided>
                  {{ $t("layout.publicHeader.user") }}
                </el-dropdown-item>
                <el-dropdown-item v-if="isAuthenticated" command="logout" divided>
                  {{ $t("layout.publicHeader.logout") }}
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
  import {mapState} from "vuex";
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
