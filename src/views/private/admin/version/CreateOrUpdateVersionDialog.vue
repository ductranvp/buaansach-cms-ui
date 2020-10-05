<template>
    <el-dialog
            title="Tạo hoặc sửa phiên bản"
            :visible.sync="dialogFormVisible"
            :close-on-click-modal="false"
            :before-close="beforeClose"
    >
        <el-form :model="form" ref="form" :rules="formRules">
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

            <el-form-item>
                <el-row type="flex">
                    <el-col :span="11">
                        <el-form-item prop="versionType">
                            <input-label label="Loại phiên bản" required/>
                            <el-select class="full-width" v-model="form.versionType">
                                <el-option
                                        v-for="item in versionTypeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="2">
                        <el-form-item prop="versionDescription">
                            <input-label label="Mô tả"/>
                            <el-input v-model="form.versionDescription"></el-input>
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

  import NotificationUtils from '@/utils/notification.util';
  import VersionType from '@/enum/VersionType';
  import AdminVersionService from '@/service/admin/admin.version.service';

  export default {
    name: 'CreateOrUpdateVersionDialog',
    data() {
      return {
        dialogFormVisible: false,
        isLoading: false,
        form: {
          versionName: null,
          versionDescription: null,
          versionType: null,
          versionNumber: null,
        },
        formRules: {},
        versionTypeOptions: VersionType.optionArray,
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
      },
      beforeClose(done) {
        this.resetForm();
        done();
      },
      async submit() {
        try {
          this.isLoading = true;
          await AdminVersionService.createVersion(this.form);
          NotificationUtils.success("Tạo thành công");
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
