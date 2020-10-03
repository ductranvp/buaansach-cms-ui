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
          <el-form-item prop="userLogin">
            <input-label label="Tên đăng nhập" required/>
            <el-input maxlength="50" ref="userLogin" :disabled="isEdit" v-model="form.userLogin"
                      show-word-limit></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="11" :offset="2">
          <el-form-item prop="userPassword">
            <input-label label="Mật khẩu" required/>
            <el-input autocomplete="new-password"
                      :disabled="isEdit"
                      ref="userPassword"
                      maxlength="100"
                      v-model="form.userPassword"
                      type="password"
                      show-word-limit
                      show-password></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item prop="fullName">
        <input-label label="Họ Tên" required/>
        <el-input ref="fullName" maxlength="100" v-model="form.fullName" show-word-limit></el-input>
      </el-form-item>

      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="userEmail">
            <input-label label="Email" required/>
            <el-input ref="userEmail" maxlength="255" v-model="form.userEmail" show-word-limit></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="11" :offset="2">
          <el-form-item prop="userPhone">
            <input-label label="SĐT" required/>
            <el-input maxlength="10" v-model="form.userPhone" show-word-limit></el-input>
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
            <input-label label="Nhóm Quyền" required/>
            <el-select :disabled="currentUser.userLogin === form.userLogin" multiple class="full-width"
                       v-model="form.authorities">
              <el-option
                      v-for="auth in authorities"
                      :key="auth.value"
                      :label="auth.label"
                      :value="auth.value">
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
  import Constants from "@/utils/constants";
  import Authority from "@/enum/Authority";
  import Language from "@/enum/Language";

  export default {
    name: "CreateOrUpdateUserDialog",
    data() {
      return {
        dialogFormVisible: false,
        isEdit: false,
        isLoading: false,
        form: {
          userLogin: null,
          userEmail: null,
          userPhone: null,
          userPassword: null,
          userActivated: null,
          authorities: null,
          fullName: null,
          langKey: null,
        },
        formRules: {
          userLogin: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
            {max: 50, message: this.$t("common.entity.validation.maxlength", {max: 50}), trigger: "blur"},
            {
              pattern: Constants.LOGIN_REGEX,
              message: this.$t("common.entity.validation.pattern", {pattern: Constants.LOGIN_REGEX}),
              trigger: "blur"
            }
          ],
          userEmail: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
            {type: 'email', message: this.$t("common.entity.validation.email"), trigger: "blur"},
            {max: 255, message: this.$t("common.entity.validation.maxlength", {max: 255}), trigger: "blur"}
          ],
          userPhone: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
            {max: 10, message: this.$t("common.entity.validation.maxlength", {max: 10}), trigger: "blur"},
            {
              pattern: Constants.PHONE_REGEX,
              message: this.$t("common.entity.validation.pattern", {pattern: Constants.PHONE_REGEX}),
              trigger: "blur"
            }
          ],
          userPassword: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
            {max: 100, message: this.$t("common.entity.validation.maxlength", {max: 100}), trigger: "blur"},
            {min: 4, message: this.$t("common.entity.validation.minlength", {min: 4}), trigger: "blur"}
          ],
          fullName: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
            {max: 50, message: this.$t("common.entity.validation.maxlength", {max: 50}), trigger: "blur"}
          ],
          langKey: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
          ],
          authorities: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
          ],
        },
        languages: Language.optionArray,
        authorities: Authority.optionArray,
      };
    },
    methods: {
      onOpened() {
        if (this.isEdit) {
          this.$refs.fullName.focus();
        } else {
          this.$refs.userLogin.focus();
        }
      },
      create() {
        this.form = {
          langKey: Language.value.vi,
          userActivated: true,
          authorities: [],
        };
        this.formRules.userPassword = [
          {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
          {max: 100, message: this.$t("common.entity.validation.maxlength", {max: 100}), trigger: "blur"},
          {min: 4, message: this.$t("common.entity.validation.minlength", {min: 4}), trigger: "blur"}
        ];
        this.isEdit = false;
        this.show();
      },
      edit(user) {
        this.formRules.userPassword = [];
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
              vm.$emit("saved");
              vm.hide();
            } catch (error) {
              NotificationUtils.error(error.message || error.data.message);
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

</style>
