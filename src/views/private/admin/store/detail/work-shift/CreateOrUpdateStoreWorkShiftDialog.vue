<template>
  <el-dialog
          :visible.sync="dialogFormVisible"
          title="Tạo hoặc cập nhật ca làm việc"
          :close-on-click-modal="false"
          :before-close="beforeClose"
          :destroy-on-close="true"
  >
    <el-form ref="dialogForm" :model="form" :rules="formRules">
      <el-form-item prop="storeWorkShiftName">
        <input-label label="Tên ca làm việc" required/>
        <el-input v-model="form.storeWorkShiftName"></el-input>
      </el-form-item>

      <el-form-item prop="storeWorkShiftDescription">
        <input-label label="Mô tả" optional/>
        <el-input v-model="form.storeWorkShiftDescription"></el-input>
      </el-form-item>

      <el-form-item prop="Khung giờ làm việc">
        <el-col :span="11">
          <el-form-item prop="storeWorkShiftStart">
            <input-label label="Bắt đầu" required/>
            <el-input v-model="form.storeWorkShiftStart"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item prop="storeWorkShiftEnd">
            <input-label label="Kết thúc" required/>
            <el-input v-model="form.storeWorkShiftEnd"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="hide">
        <span>{{$t('common.entity.action.cancel')}}</span>
      </el-button>
      <el-button type="primary" @click="submit" :loading="isLoading">
        <span>{{$t('common.entity.action.save')}}</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import AppUtils from '@/utils/app.util';
  import ErrorUtils from '@/utils/error.util';
  import AdminStoreWorkShiftService from '@/service/admin/admin.store-work-shift.service';

  export default {
    name: 'CreateOrUpdateStoreWorkShiftDialog',
    data() {
      return {
        isEdit: false,
        isLoading: false,
        dialogFormVisible: false,
        form: {
          guid: null,
          storeWorkShiftName: null,
          storeWorkShiftDescription: null,
          storeWorkShiftStart: null,
          storeWorkShiftEnd: null,
          storeGuid: null,
        },
        formRules: {
          storeWorkShiftName: [
            {required: true, message: this.$t('common.entity.validation.required'), trigger: 'blur'},
          ],
          storeWorkShiftStart: [
            {required: true, message: this.$t('common.entity.validation.required'), trigger: 'blur'},
          ],
          storeWorkShiftEnd: [
            {required: true, message: this.$t('common.entity.validation.required'), trigger: 'blur'},
          ],
        },
      };
    },
    methods: {
      create() {
        this.isEdit = false;
        this.form = {
          storeGuid: this.$route.params.storeGuid,
        };
        this.show();
      },
      edit(entity) {
        this.isEdit = true;
        this.form = {
          ...AppUtils.deepCopy(entity),
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
        this.$refs.dialogForm.clearValidate();
        this.$refs.dialogForm.resetFields();
      },
      beforeClose(done) {
        this.resetForm();
        done();
      },
      submit() {
        this.$refs.dialogForm.validate(async valid => {
          if (valid) {
            try {
              this.isLoading = true;
              if (this.isEdit) {
                await AdminStoreWorkShiftService.updateStoreWorkShift(this.form);
              } else {
                await AdminStoreWorkShiftService.createStoreWorkShift(this.form);
              }
              this.$emit('saved');
              this.hide();
            } catch (error) {
              ErrorUtils.showErrorMessage(error);
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
