<template>
  <el-dialog
    title="Thêm nhân viên"
    :visible.sync="dialogFormVisible"
    :before-close="beforeClose"
    :close-on-click-modal="false"
    @opened="dialogOpened"
  >
    <el-form ref="addsStoreUserForm" :model="form" :rules="formRules">
      <el-form-item prop="principal">
        <input-label label="Tên đăng nhập, email hoặc SĐT" required/>
        <el-input ref="principal" maxlength="100" v-model="form.principal" show-word-limit></el-input>
      </el-form-item>

      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="storeUserRole">
            <input-label :label="$t('private.adminStoreDetailHumanPage.storeUser.storeUserRole')"/>
            <el-select class="full-width" v-model="form.storeUserRole">
              <el-option
                v-for="role in storeUserRole"
                :key="role.value"
                :label="role.label"
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
                :label="status.label"
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
  import StoreUserRole from "@/enum/StoreUserRole";
  import StoreUserStatus from "@/enum/StoreUserStatus";

  export default {
    name: "AddStoreUserDialog",
    data() {
      return {
        isLoading: false,
        dialogFormVisible: false,
        form: {
          storeGuid: null,
          principal: null,
          storeUserRole: null,
          storeUserStatus: null,
        },
        formRules: {
          principal: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
            {max: 100, message: this.$t("common.entity.validation.maxlength", {max: 100}), trigger: "blur"}
          ]
        },
        storeUserRole: StoreUserRole.optionArray,
        storeUserStatus: StoreUserStatus.optionArray
      };
    },
    methods: {
      dialogOpened() {
        this.$refs.principal.focus();
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
        this.form = {
          storeGuid: this.$route.params.storeGuid,
          storeUserRole: StoreUserRole.value.STORE_WAITER,
          storeUserStatus: StoreUserStatus.value.WORKING,
        };
        this.show();
      },
      resetForm() {
        this.$refs.addsStoreUserForm.clearValidate();
        this.$refs.addsStoreUserForm.resetFields();
      },
      submit() {
        this.$refs.addsStoreUserForm.validate(async valid => {
          if (valid) {
            try {
              this.isLoading = true;
              const {data} = await AdminStoreUserService.addStoreUser(this.form);
              this.$emit("addStoreUser", data);
              this.hide();
            } catch (error) {
              NotificationUtils.error(error.message || error.data.message);
            } finally {
              this.isLoading = false;
            }
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
