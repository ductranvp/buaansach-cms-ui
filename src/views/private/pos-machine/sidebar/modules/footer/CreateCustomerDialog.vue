<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    title="Thêm khách hàng"
    width="300px"
    @opened="onOpened"
    :close-on-click-modal="false"
    :before-close="beforeClose"
    :destroy-on-close="true"
  >
    <el-form ref="dialogForm" :model="form" :rules="formRules">
      <el-form-item prop="customerName">
        <input-label label="Tên khách hàng" optional/>
        <el-input ref="customerName" v-model="form.customerName"></el-input>
      </el-form-item>

      <el-form-item prop="customerPhone">
        <input-label label="SĐT khách hàng" required/>
        <el-row :gutter="10" type="flex" align="middle">
          <el-col>
            <el-input ref="customerPhone" v-model="form.customerPhone"></el-input>
          </el-col>
          <el-button :disabled="!form.customerPhone" @click="copyCustomerPhone">
            <i v-if="!isCopied" class="el-icon-document-copy"></i>
            <i v-else class="el-icon-check"></i>
            <span v-if="!isCopied">Copy</span>
            <span v-else>Đã copy</span>
          </el-button>
        </el-row>
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
  import PosCustomerService from "@/service/pos/pos.customer.service";

  export default {
    name: "CreateCustomerDialog",
    data() {
      return {
        isCopied: false,
        isEdit: false,
        isLoading: false,
        dialogFormVisible: false,
        form: {
          customerName: null,
          customerPhone: null,
        },
        formRules: {
          customerPhone: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: 'blur'},
            {max: 10, message: this.$t("common.entity.validation.maxlength", {max: 10}), trigger: "blur"},
            {
              pattern: "^(09|03|07|08|05)+([0-9]{8})$",
              message: "Số điện thoại không hợp lệ",
              trigger: "blur"
            }
          ],
        }
      };
    },
    methods: {
      create() {
        this.isCopied = false;
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
      onOpened() {
        this.$refs.customerName.focus();
      },
      copyCustomerPhone() {
        this.$refs.customerPhone.select();
        document.execCommand("copy");
        this.isCopied = true;
      },
      submit() {
        const vm = this;
        this.$refs.dialogForm.validate(async valid => {
          if (valid) {
            try {
              vm.isLoading = true;
              await PosCustomerService.createCustomer(vm.form);
              NotificationUtils.success("Thêm khách hàng thành công");
              vm.isLoading = false;
              this.hide();
            } catch (error) {
              vm.isLoading = false;
              NotificationUtils.error("Đã xảy ra lỗi, vui lòng thử lại");
            }
          }
        });
      },
    }
  };
</script>

<style scoped>
</style>
