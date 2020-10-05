<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    title="Tạo khách hàng"
    width="300px"
    @opened="onOpened"
    :close-on-click-modal="false"
    :before-close="beforeClose"
  >
    <el-form ref="dialogForm" :model="form" :rules="formRules">
      <el-form-item prop="customerName">
        <input-label label="Tên khách hàng" required/>
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
      <el-form-item prop="customerGender" required>
        <input-label label="Giới tính"/>
        <el-radio v-model="form.customerGender" v-for="gen in genders" :label="gen.value" :key="gen.value">
          <span>{{gen.label}}</span>
        </el-radio>
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
  import PosCustomerService from "@/service/pos/pos.customer.service";
  import MessageUtils from "@/utils/message.util";

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
          customerGender: "MALE",
          customerPhone: null,
        },
        formRules: {
          customerName: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: 'blur'},
          ],
          customerGender: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: 'blur'},
          ],
          customerPhone: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: 'blur'},
            {max: 10, message: this.$t("common.entity.validation.maxlength", {max: 10}), trigger: "blur"},
            {
              pattern: "^(09|03|07|08|05)+([0-9]{8})$",
              message: "Số điện thoại không hợp lệ",
              trigger: "blur"
            }
          ],
        },
        genders: [
          {label: "Nam", value: "MALE"},
          {label: "Nữ", value: "FEMALE"},
          {label: "Khác", value: "UNDEFINED"},
        ]
      };
    },
    methods: {
      create(phone) {
        this.isCopied = false;
        this.form = {
          customerPhone: phone ? phone : null,
          customerGender: "MALE",
        };
        this.isEdit = false;
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
              vm.form.storeGuid = vm.$route.params.storeGuid;
              const {data} = await PosCustomerService.createCustomer(vm.form);
              vm.isLoading = false;
              vm.$emit("customer-created", data);
              vm.hide();
            } catch (error) {
              vm.isLoading = false;
              const msg = error.message || error.data.message;
              if (msg.includes("customerPhoneExist")) {
                MessageUtils.error("Khách hàng đã tồn tại trên hệ thống!");
                return;
              }
              MessageUtils.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
            }
          }
        });
      },
    }
  };
</script>

<style scoped>
</style>
