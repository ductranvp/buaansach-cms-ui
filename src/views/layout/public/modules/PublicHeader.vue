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
          >Bữa Ăn Sạch</el-button
        >
      </el-col>
      <el-col class="hidden-sm-and-down" :span="8">
        <el-input placeholder="Search">
          <el-button slot="append" icon="el-icon-search" />
        </el-input>
      </el-col>
      <el-col :span="8">
        <el-row type="flex" justify="end" class="pr-20" align="middle">
          <div
            class="pr-20"
            @click="
              () => {
                this.$router.push('/order');
              }
            "
          >
            <el-button class="transparent-btn">Order</el-button>
          </div>
          <div class="pr-20">
            <el-dropdown @command="changeLanguage">
              <span class="el-dropdown-link">
                Language<i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="lang.value"
                  v-for="lang in languages"
                  :key="lang.name"
                  :class="
                    currentLanguage === lang.value ? 'active-language' : ''
                  "
                  >{{ lang.name }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div>
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                Menu<i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="AboutPage"
                  >About Us</el-dropdown-item
                >
                <el-dropdown-item command="ContactPage"
                  >Contact Us</el-dropdown-item
                >
                <el-dropdown-item command="ProductPage"
                  >Product</el-dropdown-item
                >
                <el-dropdown-item command="SalePage">Sale</el-dropdown-item>
                <el-dropdown-item
                  v-if="!isAuthenticated"
                  command="LoginPage"
                  divided
                  >Login</el-dropdown-item
                >
                <el-dropdown-item
                  v-if="hasAnyRole(['ROLE_ADMIN'])"
                  command="AdminDashboardPage"
                  divided
                  >{{ $t("admin.title") }}</el-dropdown-item
                >
                <el-dropdown-item
                  v-if="hasAnyRole(['ROLE_MANAGER'])"
                  command="ManagerDashboardPage"
                  >{{ $t("manager.title") }}</el-dropdown-item
                >
                <el-dropdown-item
                  v-if="hasAnyRole(['ROLE_EMPLOYEE'])"
                  command="EmployeeDashboardPage"
                  >{{ $t("employee.title") }}</el-dropdown-item
                >
                <el-dropdown-item
                  v-if="isAuthenticated"
                  command="Logout"
                  divided
                  >Logout</el-dropdown-item
                >
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
      if (value === "Logout") {
        AuthUtils.logout();
      } else {
        this.$router.push({ name: value });
      }
    },
    changeLanguage(lang) {
      i18n.changeLanguage(lang);
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
.active-language {
  background: #3a71a8;
}
</style>
