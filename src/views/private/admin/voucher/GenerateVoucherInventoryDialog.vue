<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    title=""
    :close-on-click-modal="false"
    :before-close="beforeClose"
    :destroy-on-close="true"
  >
    <el-form ref="dialogForm" :model="form" :rules="formRules">

      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="voucherCodeLength">
            <input-label label="Độ dài mã" required/>
            <el-input v-model.number="form.voucherCodeLength"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item prop="numberOfVoucherCode">
            <input-label label="Số lượng mã" required/>
            <el-input v-model.number="form.numberOfVoucherCode"></el-input>
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
  import AdminVoucherInventoryService from "@/service/admin/admin.voucher-inventory.service";

  export default {
    name: "GenerateVoucherInventoryDialog",
    data() {
      return {
        isEdit: false,
        isLoading: false,
        dialogFormVisible: false,
        form: {
          voucherCodeLength: null,
          numberOfVoucherCode: null,
        },
        formRules: {
          voucherCodeLength: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: 'blur'},
            {type: 'number', min: 5, message: this.$t("common.entity.validation.min", {min: 5}), trigger: "blur"},
            {type: 'number', max: 15, message: this.$t("common.entity.validation.max", {max: 15}), trigger: "blur"}
          ],
          numberOfVoucherCode: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: 'blur'},
            {type: 'number', min: 1, message: this.$t("common.entity.validation.min", {min: 1}), trigger: "blur"},
            {
              type: 'number',
              max: 1000000,
              message: this.$t("common.entity.validation.max", {max: 1000000}),
              trigger: "blur"
            }
          ]
        }
      };
    },
    methods: {
      create() {
        this.form = {};
        this.isEdit = false;
        this.show();
      },
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
        this.$refs.dialogForm.validate(async valid => {
          if (valid) {
            try {
              this.isLoading = true;
              await AdminVoucherInventoryService.generateVoucherInventory(this.form);
              NotificationUtils.success(this.$t("common.entity.save.success"));
              this.$emit("inventoryUpdated");
              this.hide();
              this.isLoading = false;
            } catch (error) {
              this.isLoading = false;
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
