<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    title="Cập nhật voucher"
    :close-on-click-modal="false"
    :before-close="beforeClose"
    :destroy-on-close="true"
  >
    <el-form ref="dialogForm" :model="form" :rules="formRules">
      <el-form-item>
        <el-form-item prop="voucherName">
          <input-label label="Tên voucher" required/>
          <el-input v-model="form.voucherName" maxlength="50" show-word-limit></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item prop="voucherDescription">
        <input-label label="Mô tả" optional/>
        <el-input type="textarea" v-model="form.voucherDescription" maxlength="255" show-word-limit></el-input>
      </el-form-item>
      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="voucherDiscountType">
            <input-label label="Loại giảm giá" optional/>
            <el-select class="full-width" v-model="form.voucherDiscountType">
              <el-option v-for="item in voucherDiscountTypes"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item prop="voucherDiscount">
            <input-label label="Giảm giá" required/>
            <el-input v-model.number="form.voucherDiscount"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="hide">
        <span>{{$t("common.entity.action.cancel")}}</span>
      </el-button>
      <el-button type="primary" @click="submit" :loading="isLoading">
        <span>{{$t("common.entity.action.save")}}</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import AppUtils from "@/utils/app.util";
  import NotificationUtils from "@/utils/notification.util";
  import AdminVoucherService from "@/service/admin/admin.voucher.service";

  export default {
    name: "AdminUpdateVoucherBasic",
    data() {
      return {
        isEdit: false,
        isLoading: false,
        dialogFormVisible: false,
        form: {
          guid: null,
          voucherName: null,
          voucherDescription: null,
          voucherDiscount: null,
          voucherDiscountType: null,
        },
        formRules: {
          voucherName: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: 'blur'},
            {max: 50, message: this.$t("common.entity.validation.maxlength", {max: 50}), trigger: "blur"}
          ],
          voucherDescription: [
            {max: 255, message: this.$t("common.entity.validation.maxlength", {max: 255}), trigger: "blur"}
          ],
          voucherDiscount: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: 'blur'},
            {type: 'number', min: 1, message: this.$t("common.entity.validation.min", {min: 1}), trigger: "blur"}
          ],
          voucherDiscountType: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: 'blur'},
          ],
        },
        voucherDiscountTypes: [
          {label: "Giá trị", value: "VALUE"},
          {label: "Phần trăm", value: "PERCENT"},
        ],
      };
    },
    methods: {
      edit(entity) {
        this.isEdit = true;
        this.form = AppUtils.deepCopy(entity);
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
        const vm = this;
        this.$refs.dialogForm.validate(async valid => {
          if (valid) {
            try {
              vm.isLoading = true;
              const {data} = await AdminVoucherService.updateVoucherBasic(this.form);
              this.$emit("voucherUpdatedBasic", data);
              vm.isLoading = false;
              this.hide();
            } catch (error) {
              vm.isLoading = false;
              NotificationUtils.error(error.message || error.data.message);
            }
          }
        });
      },
    }
  };
</script>

<style scoped>

</style>
