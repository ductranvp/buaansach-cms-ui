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
                    <el-form-item prop="userPassword">
                        <input-label v-show="isEdit"
                                     :label="$t('private.adminStoreDetailHumanPage.storeUser.passwordWithoutRequired')"/>
                        <input-label v-show="!isEdit"
                                     :label="$t('private.adminStoreDetailHumanPage.storeUser.password')" required/>
                        <el-input autocomplete="new-password"
                                  ref="userPassword"
                                  maxlength="100"
                                  v-model="form.userPassword"
                                  type="password"
                                  show-word-limit
                                  show-password></el-input>
                    </el-form-item>
                </el-col>
            </el-form-item>

            <el-form-item>
                <el-col :span="11">
                    <el-form-item prop="userPhone">
                        <input-label label="SĐT" required/>
                        <el-input :disabled="isEdit" ref="userPhone" maxlength="10" v-model="form.userPhone"
                                  show-word-limit></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="11" :offset="2">
                    <el-form-item prop="userEmail">
                        <input-label label="Email" required/>
                        <el-input ref="userEmail" maxlength="255" v-model="form.userEmail" show-word-limit></el-input>
                    </el-form-item>
                </el-col>
            </el-form-item>


            <el-form-item prop="fullName">
                <input-label label="Họ tên" required/>
                <el-input ref="fullName" maxlength="100" v-model="form.fullName" show-word-limit></el-input>
            </el-form-item>

            <el-form-item>
                <el-col :span="11">
                    <el-form-item prop="storeUserRole">
                        <input-label :label="$t('private.adminStoreDetailHumanPage.storeUser.storeUserRole')"/>
                        <el-select class="full-width" v-model="form.storeUserRole">
                            <el-option
                                    v-for="item in storeUserRole"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="11" :offset="2">
                    <el-form-item prop="storeUserStatus">
                        <input-label :label="$t('private.adminStoreDetailHumanPage.storeUser.storeUserStatus')"/>
                        <el-select class="full-width" v-model="form.storeUserStatus">
                            <el-option
                                    v-for="item in storeUserStatus"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="hide">
                <span>{{ $t('common.entity.action.cancel') }}</span>
            </el-button>
            <el-button type="primary" @click="submit" :loading="isLoading">
                <span>{{ $t('common.entity.action.save') }}</span>
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
  import AdminStoreUserService from '@/service/admin/admin.store-user.service';
  import NotificationUtils from '@/utils/notification.util';
  import {mapState} from 'vuex';
  import StoreUserRole from '@/enum/StoreUserRole';
  import StoreUserStatus from '@/enum/StoreUserStatus';
  import AppUtils from '@/utils/app.util';
  import Constants from '@/utils/constants';

  export default {
    name: 'CreateOrUpdateStoreUserDialog',
    computed: {
      ...mapState({
        adminCurrentStore: state => state.adminStore.adminCurrentStore,
      }),
    },
    data() {
      return {
        dialogFormVisible: false,
        isLoading: false,
        isEdit: false,
        form: {
          guid: null,
          storeGuid: null,
          userLogin: null,
          userEmail: null,
          userPhone: null,
          userPassword: null,
          fullName: null,
          storeUserRole: null,
          storeUserStatus: null,
        },
        formRules: {
          userLogin: [
            {required: true, message: this.$t('common.entity.validation.required'), trigger: 'blur'},
            {max: 50, message: this.$t('common.entity.validation.maxlength', {max: 50}), trigger: 'blur'},
          ],
          userPassword: [
            {required: true, message: this.$t('common.entity.validation.required'), trigger: 'blur'},
            {max: 100, message: this.$t('common.entity.validation.maxlength', {max: 100}), trigger: 'blur'},
          ],
          userEmail: [
            {required: true, message: this.$t('common.entity.validation.required'), trigger: 'blur'},
            {type: 'email', message: this.$t('common.entity.validation.email'), trigger: 'blur'},
            {max: 255, message: this.$t('common.entity.validation.maxlength', {max: 255}), trigger: 'blur'},
          ],
          userPhone: [
            {required: true, message: this.$t('common.entity.validation.required'), trigger: 'blur'},
            {max: 10, message: this.$t('common.entity.validation.maxlength', {max: 10}), trigger: 'blur'},
            {
              pattern: Constants.PHONE_REGEX,
              message: this.$t('common.entity.validation.pattern', {pattern: Constants.PHONE_REGEX}),
              trigger: 'blur',
            },
          ],
          fullName: [
            {required: true, message: this.$t('common.entity.validation.required'), trigger: 'blur'},
            {max: 100, message: this.$t('common.entity.validation.maxlength', {max: 100}), trigger: 'blur'},
          ],
        },
        storeUserRole: StoreUserRole.optionArray,
        storeUserStatus: StoreUserStatus.optionArray,
      };
    },
    methods: {
      dialogOpened() {
        if (this.isEdit) this.$refs.fullName.focus();
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
        vm.$refs.storeUserForm.clearValidate();
        vm.$refs.storeUserForm.resetFields();
      },
      create() {
        this.isEdit = false;
        this.form = {
          storeGuid: this.$route.params.storeGuid,
          storeUserRole: StoreUserRole.value.STORE_WAITER,
          storeUserStatus: StoreUserStatus.value.WORKING,
        };
        this.formRules.userPassword = [
          {required: true, message: this.$t('common.entity.validation.required'), trigger: 'blur'},
          {max: 100, message: this.$t('common.entity.validation.maxlength', {max: 100}), trigger: 'blur'},
        ];
        this.show();
      },
      edit(storeUser) {
        this.isEdit = true;
        this.formRules.userPassword = [
          {max: 100, message: this.$t('common.entity.validation.maxlength', {max: 100}), trigger: 'blur'},
        ];
        this.form = AppUtils.deepCopy(storeUser);
        this.show();
      },
      submit() {
        this.$refs.storeUserForm.validate(async valid => {
          if (valid) {
            try {
              let response;
              this.isLoading = true;
              if (!this.isEdit) {
                response = await AdminStoreUserService.createStoreUser(this.form);
                this.$emit('createStoreUser', response.data);
              } else {
                response = await AdminStoreUserService.updateStoreUser(this.form);
                this.$emit('updateStoreUser', response.data);
              }
              this.hide();
              NotificationUtils.success(this.$t('common.entity.save.success'));
            } catch (error) {
              NotificationUtils.error(error.message || error.data.message);
            } finally {
              this.isLoading = false;
            }
          }
        });
      },
    },
  };
</script>

<style scoped>

</style>
