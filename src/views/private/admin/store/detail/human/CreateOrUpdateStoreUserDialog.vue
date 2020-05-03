<template>
  <el-dialog
    :title="$t('private.adminStoreDetailHumanPage.dialog.title')"
    :visible.sync="dialogFormVisible"
    :before-close="beforeClose"
    :close-on-click-modal="false"
    @opened="dialogOpened"
  >
    <el-form ref="storeUserForm" :model="form" :rules="formRules">
      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="userLogin">
            <input-label :label="$t('private.adminStoreDetailHumanPage.storeUser.userLogin')" required/>
            <el-input maxlength="50" ref="userLogin" :disabled="isEdit" v-model="form.userLogin"
                      show-word-limit></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="11" :offset="2">
          <el-form-item prop="password">
            <input-label v-show="isEdit"
                         :label="$t('private.adminStoreDetailHumanPage.storeUser.passwordWithoutRequired')"/>
            <input-label v-show="!isEdit" :label="$t('private.adminStoreDetailHumanPage.storeUser.password')" required/>
            <el-input autocomplete="new-password"
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
            <input-label :label="$t('private.adminStoreDetailHumanPage.storeUser.lastName')" required/>
            <el-input ref="lastName" maxlength="50" v-model="form.lastName" show-word-limit></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="11" :offset="2">
          <el-form-item prop="firstName">
            <input-label :label="$t('private.adminStoreDetailHumanPage.storeUser.firstName')" required/>
            <el-input maxlength="50" v-model="form.firstName" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="storeUserRole">
            <input-label :label="$t('private.adminStoreDetailHumanPage.storeUser.storeUserRole')"/>
            <el-select class="full-width" v-model="form.storeUserRole">
              <el-option
                v-for="role in storeUserRole"
                :key="role.value"
                :label="$t(role.label)"
                :value="role.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="11" :offset="2">
          <el-form-item prop="storeUserStatus">
            <input-label :label="$t('private.adminStoreDetailHumanPage.storeUser.storeUserStatus')"/>
            <el-select class="full-width" v-model="form.storeUserStatus">
              <el-option
                v-for="status in storeUserStatus"
                :key="status.value"
                :label="$t(status.label)"
                :value="status.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hide">
        <span>{{ $t("common.entity.action.cancel") }}</span>
      </el-button>
      <el-button type="primary" @click="submit" :loading="isLoading">
        <span>{{ $t("common.entity.action.save") }}</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import AdminStoreUserService from "@/service/admin/admin.store-user.service";
  import NotificationUtils from "@/utils/notification.util";
  import {mapState} from "vuex";

  export default {
    name: "CreateOrUpdateStoreUserDialog",
    computed: {
      ...mapState({
        adminCurrentStore: state => state.adminStore.adminCurrentStore
      })
    },
    data() {
      return {
        dialogFormVisible: false,
        isLoading: false,
        isEdit: false,
        form: {
          guid: null,
          storeGuid: null,
          userCode: null,
          userLogin: null,
          userLoginOrEmail: null,
          password: null,
          firstName: null,
          lastName: null,
          activated: null,
          storeUserRole: "STORE_WAITER",
          storeUserStatus: "WORKING",
          createdBy: null,
          createdDate: null,
          lastModifiedBy: null,
          lastModifiedDate: null
        },
        formRules: {
          userLogin: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
            {max: 50, message: this.$t("common.entity.validation.maxlength", {max: 50}), trigger: "blur"}
          ],
          password: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
            {max: 100, message: this.$t("common.entity.validation.maxlength", {max: 100}), trigger: "blur"}
          ],
          firstName: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
            {max: 50, message: this.$t("common.entity.validation.maxlength", {max: 50}), trigger: "blur"}
          ],
          lastName: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
            {max: 50, message: this.$t("common.entity.validation.maxlength", {max: 50}), trigger: "blur"}
          ]
        },
        storeUserRole: [
          {
            value: "STORE_OWNER",
            label: "private.adminStoreDetailHumanPage.storeUserRole.owner"
          },
          {
            value: "STORE_MANAGER",
            label: "private.adminStoreDetailHumanPage.storeUserRole.manager"
          },
          {
            value: "STORE_CASHIER",
            label: "private.adminStoreDetailHumanPage.storeUserRole.cashier"
          },
          {
            value: "STORE_WAITER",
            label: "private.adminStoreDetailHumanPage.storeUserRole.waiter"
          }
        ],
        storeUserStatus: [
          {
            value: "WORKING",
            label: "private.adminStoreDetailHumanPage.storeUserStatus.working"
          },
          {
            value: "FIRED",
            label: "private.adminStoreDetailHumanPage.storeUserStatus.fired"
          },
          {
            value: "QUIT",
            label: "private.adminStoreDetailHumanPage.storeUserStatus.quit"
          }
        ]
      };
    },
    methods: {
      dialogOpened() {
        if (this.isEdit) this.$refs.lastName.focus();
        else this.$refs.userLogin.focus();
      },
      show() {
        this.dialogFormVisible = true;
      },
      hide() {
        this.resetForm();
        this.dialogFormVisible = false;
      },
      beforeClose(done) {
        this.resetForm();
        done();
      },
      resetForm() {
        const vm = this;
        this.form = {storeUserRole: "STORE_WAITER", storeUserStatus: "WORKING"};
        vm.$refs.storeUserForm.clearValidate();
        vm.$refs.storeUserForm.resetFields();
      },
      create() {
        this.isEdit = false;
        this.show();
      },
      edit(storeUser) {
        this.isEdit = true;
        this.formRules.password = [
          {max: 100, message: this.$t("common.entity.validation.maxlength", {max: 100}), trigger: "blur"}
        ];
        this.form = JSON.parse(JSON.stringify(storeUser));
        this.show();
      },
      submit() {
        this.$refs.storeUserForm.validate(async valid => {
          if (valid) {
            try {
              let response;
              // this.isLoading = true;
              this.form.storeGuid = this.$route.params.storeGuid;
              if (!this.isEdit) {
                response = await AdminStoreUserService.createStoreUser(this.form);
                this.$emit("createStoreUser", response.data);
              } else {
                response = await AdminStoreUserService.updateStoreUser(this.form);
                this.$emit("updateStoreUser", response.data);
              }
              this.isLoading = false;
              this.hide();
              NotificationUtils.success(this.$t("common.entity.save.success"));
            } catch (error) {
              this.isLoading = false;
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
