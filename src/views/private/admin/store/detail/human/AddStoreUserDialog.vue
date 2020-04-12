<template>
  <el-dialog
    :title="$t('private.adminStoreDetailHumanPage.dialog.title')"
    :visible.sync="dialogFormVisible"
    :before-close="beforeClose"
    :close-on-click-modal="false"
    @opened="dialogOpened"
  >
    <el-form ref="addsStoreUserForm" :model="form" :rules="formRules">
      <el-form-item prop="userLoginOrEmail">
        <input-label :label="$t('private.adminStoreDetailHumanPage.storeUser.userLoginOrEmail')" required/>
        <el-input ref="userLoginOrEmail" maxlength="100" v-model="form.userLoginOrEmail" show-word-limit></el-input>
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

  export default {
    name: "AddStoreUserDialog",
    data() {
      return {
        isLoading: false,
        dialogFormVisible: false,
        form: {
          storeGuid: null,
          userLoginOrEmail: null,
          storeUserRole: "WAITER",
          storeUserStatus: "WORKING",
        },
        formRules: {
          userLoginOrEmail: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
            {max: 100, message: this.$t("common.entity.validation.maxlength", {max: 100}), trigger: "blur"}
          ]
        },
        storeUserRole: [
          {
            value: "OWNER",
            label: "private.adminStoreDetailHumanPage.storeUserRole.owner"
          },
          {
            value: "MANAGER",
            label: "private.adminStoreDetailHumanPage.storeUserRole.manager"
          },
          {
            value: "CASHIER",
            label: "private.adminStoreDetailHumanPage.storeUserRole.cashier"
          },
          {
            value: "WAITER",
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
      dialogOpened(){
        this.$refs.userLoginOrEmail.focus();
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
      add() {
        this.show();
      },
      resetForm() {
        const vm = this;
        this.form = {storeUserRole: "WAITER", storeUserStatus: "WORKING"};
        vm.$refs.addsStoreUserForm.clearValidate();
        vm.$refs.addsStoreUserForm.resetFields();
      },
      submit() {
        this.$refs.addsStoreUserForm.validate(async valid => {
          if (valid) {
            try {
              this.isLoading = true;
              this.form.storeGuid = this.$route.params.storeGuid;
              const {data} = await AdminStoreUserService.addStoreUser(this.form);
              this.$emit("addStoreUser", data);
              this.isLoading = false;
              this.hide();
              NotificationUtils.success("Save successfully");
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
