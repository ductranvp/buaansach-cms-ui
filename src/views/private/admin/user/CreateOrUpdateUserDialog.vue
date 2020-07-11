<template>
  <el-dialog
    :close-on-click-modal="false"
    :before-close="beforeClose"
    :visible.sync="dialogFormVisible"
    @opened="onOpened"
  >
    <el-form ref="userForm" :model="form" :rules="formRules">
      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="login">
            <input-label label="Tên đăng nhập" required/>
            <el-input maxlength="50" ref="login" :disabled="isEdit" v-model="form.login" show-word-limit></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="11" :offset="2">
          <el-form-item prop="password">
            <input-label label="Mật khẩu" required/>
            <el-input autocomplete="new-password"
                      :disabled="isEdit"
                      ref="password"
                      maxlength="100"
                      v-model="form.password"
                      type="password"
                      show-word-limit
                      show-password></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="lastName">
            <input-label label="Họ" required/>
            <el-input ref="lastName" maxlength="50" v-model="form.lastName" show-word-limit></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="11" :offset="2">
          <el-form-item prop="firstName">
            <input-label label="Tên" required/>
            <el-input maxlength="50" v-model="form.firstName" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="email">
            <input-label label="Email" required/>
            <el-input ref="email" maxlength="255" v-model="form.email" show-word-limit></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="11" :offset="2">
          <el-form-item prop="phone">
            <input-label label="SĐT" optional/>
            <el-input maxlength="10" v-model="form.phone" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="langKey">
            <input-label label="Ngôn ngữ" required/>
            <el-select class="full-width" v-model="form.langKey">
              <el-option
                v-for="lang in languages"
                :key="lang.value"
                :label="lang.label"
                :value="lang.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="11" :offset="2">
          <el-form-item prop="authorities">
            <input-label label="Quyền" required/>
            <el-select :disabled="currentUser.login === form.login" multiple class="full-width" v-model="form.authorities">
              <el-option
                v-for="lang in roles"
                :key="lang.value"
                :label="lang.label"
                :value="lang.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hide($event)">
        <span>{{ $t("common.entity.action.cancel") }}</span>
      </el-button>
      <el-button type="primary" @click="submit" :loading="isLoading">
        <span>{{ $t("common.entity.action.save") }}</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import AppUtils from "@/utils/app.util";
  import NotificationUtils from "@/utils/notification.util";
  import AdminUserService from "@/service/admin/admin.user.service";
  import {mapState} from "vuex";

  export default {
    name: "CreateOrUpdateUserDialog",
    computed: {
      ...mapState({
        currentUser: state => state.user.info
      })
    },
    data() {
      return {
        dialogFormVisible: false,
        isEdit: false,
        isLoading: false,
        form: {
          firstName: null,
          lastName: null,
          login: null,
          password: null,
          email: null,
          phone: null,
          langKey: "vi",
          authorities: [],
        },
        formRules: {
          firstName: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
            {max: 50, message: this.$t("common.entity.validation.maxlength", {max: 50}), trigger: "blur"}
          ],
          lastName: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
            {max: 50, message: this.$t("common.entity.validation.maxlength", {max: 50}), trigger: "blur"}
          ],
          login: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
            {max: 50, message: this.$t("common.entity.validation.maxlength", {max: 50}), trigger: "blur"}
          ],
          password: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
            {max: 100, message: this.$t("common.entity.validation.maxlength", {max: 100}), trigger: "blur"},
            {min: 4, message: this.$t("common.entity.validation.minlength", {min: 4}), trigger: "blur"}
          ],
          email: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
            {type: 'email', message: this.$t("common.entity.validation.email"), trigger: "blur"},
            {max: 255, message: this.$t("common.entity.validation.maxlength", {max: 255}), trigger: "blur"}
          ],
          phone: [
            {max: 10, message: this.$t("common.entity.validation.maxlength", {max: 10}), trigger: "blur"},
            {
              pattern: "^(09|03|07|08|05)+([0-9]{8})$",
              message: this.$t("common.entity.validation.pattern", {pattern: "^(09|03|07|08|05)+([0-9]{8})$"}),
              trigger: "blur"
            }
          ],
          langKey: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
          ],
          authorities: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
          ],
        },
        languages: [
          {label: "Tiếng Việt", value: "vi"},
          {label: "English", value: "en"}
        ],
        roles: [
          {label: "Quản trị viên", value: "ROLE_ADMIN"},
          {label: "Điều hành viên", value: "ROLE_MODERATOR"},
          {label: "Chăm sóc khách hàng", value: "ROLE_CUSTOMER_CARE"},
          {label: "Người dùng", value: "ROLE_USER"}
        ]
      };
    },
    methods: {
      onOpened() {
        if (this.isEdit) {
          this.$refs.lastName.focus();
        } else {
          this.$refs.login.focus();
        }
      },
      create() {
        this.form = {
          firstName: null,
          lastName: null,
          login: null,
          password: null,
          email: null,
          phone: null,
          langKey: "vi",
          authorities: [],
        };
        this.formRules.password = [
          {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
          {max: 100, message: this.$t("common.entity.validation.maxlength", {max: 100}), trigger: "blur"},
          {min: 4, message: this.$t("common.entity.validation.minlength", {min: 4}), trigger: "blur"}
        ];
        this.isEdit = false;
        this.show();
      },
      edit(user) {
        this.formRules.password = [];
        this.form = AppUtils.deepCopy(user);
        this.isEdit = true;
        this.show();
      },
      show() {
        this.dialogFormVisible = true;
      },
      hide() {
        this.resetForm();
        this.dialogFormVisible = false;
      },
      resetForm() {
        this.$refs.userForm.clearValidate();
        this.$refs.userForm.resetFields();
      },
      beforeClose(done) {
        done();
      },
      submit() {
        const vm = this;
        this.$refs.userForm.validate(async valid => {
          if (valid) {
            try {
              vm.isLoading = true;
              if (vm.isEdit) {
                await AdminUserService.updateUser(vm.form);
              } else {
                await AdminUserService.createUser(vm.form);
              }
              vm.isLoading = false;
              vm.$emit("saved");
              vm.hide();
            } catch (error) {
              vm.isLoading = false;
              NotificationUtils.error(error.message || error.data.message);
            }
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
