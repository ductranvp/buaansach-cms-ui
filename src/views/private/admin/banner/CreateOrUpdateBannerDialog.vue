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
            <el-form-item prop="bannerOrder">
              <input-label label="Thứ tự"/>
              <el-input v-model="form.bannerOrder"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item prop="bannerActivated">
        <input-label label="Kích hoạt" required/>
        <el-checkbox v-model="form.bannerActivated">
          <span v-if="form.storeActivated">Bật</span>
          <span v-else>Tắt</span>
        </el-checkbox>
      </el-form-item>

      <el-form-item>
        <input-label label="Ảnh banner" required/>
        <single-image-uploader
          ref="singleImageUploader"
          :show-clear-btn="false"
          :image-url-prop="getMediaUrl(form.bannerImageUrl)"
        />
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

  export default {
    name: 'CreateOrUpdateBannerDialog',
    data() {
      return {
        dialogFormVisible: false,
        isEdit: false,
        isLoading: false,
        form: {
          bannerImageUrl: null,
          bannerType: null,
          bannerOrder: null,
          bannerActivated: null,
        },
        formRules: {},
        bannerTypeOptions: BannerType.optionArray,
      };
    },
    methods: {
      create() {
        this.isEdit = false;
        this.form = {
          bannerType: BannerType.value.TYPE_A,
          bannerActivated: true,
        };
        this.show();
      },
      edit(banner) {
        this.isEdit = true;
        this.form = {
          ...AppUtils.deepCopy(banner),
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
          let image = this.$refs.singleImageUploader.getSelectedImage();
          if (this.isEdit) {
            await AdminBannerService.updateBanner(this.form, image);
          } else {
            await AdminBannerService.createBanner(this.form, image);
          }
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
