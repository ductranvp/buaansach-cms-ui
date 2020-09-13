<template>
  <el-dialog
    title="Tạo hoặc sửa banner"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    :before-close="beforeClose"
  >
    <el-form :model="form" ref="form" :rules="formRules">
      <el-form-item>
        <el-row type="flex">
          <el-col :span="11">
            <el-form-item prop="bannerType">
              <input-label label="Loại banner" required/>
              <el-select class="full-width" v-model="form.bannerType">
                <el-option
                  v-for="item in bannerTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item prop="versionName">
              <input-label label="Thứ tự"/>
              <el-input v-model="form.bannerOrder"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item>
        <el-row type="flex">
          <el-col :span="11">
            <el-form-item prop="versionName">
              <input-label label="Tên phiên bản"/>
              <el-input v-model="form.versionName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item prop="versionNumber">
              <input-label label="Số hiệu"/>
              <el-input v-model="form.versionNumber"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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

  import BannerType from '@/enum/BannerType';
  import AppUtils from '@/utils/app.util';
  import NotificationUtils from '@/utils/notification.util';
  import AdminBannerService from '@/service/admin/admin.banner.service';
  import VersionType from '@/enum/VersionType';

  export default {
    name: 'CreateOrUpdateBannerDialog',
    data() {
      return {
        dialogFormVisible: false,
        isLoading: false,
        form: {
          versionName: null,
          versionType: null,
          versionNumber: null,
        },
        formRules: {},
        versionTypeOptions: VersionType.optionArray
      };
    },
    methods: {
      create() {
        this.form = {
          versionType: VersionType.value.CUSTOMER_UI,
        };
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
        this.$refs.form.resetFields();
        this.$refs.form.clearValidate();
        this.$refs.singleImageUploader.clearImage();
      },
      beforeClose(done) {
        this.resetForm();
        done();
      },
      async submit() {
        try {
          this.isLoading = true;
          this.$emit('saved');
          this.hide();
        } catch (error) {
          NotificationUtils.error(error.message || error.data.message);
        } finally {
          this.isLoading = false;
        }
      },
    },
  };
</script>

<style scoped>

</style>
