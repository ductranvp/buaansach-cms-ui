<template>
  <el-dialog :close-on-click-modal="false"
             :visible.sync="dialogFormVisible"
             :before-close="beforeClose"
             :destroy-on-close="true"
             title="Tạo hoặc cập nhật voucher">
    <el-form ref="voucherForm" :model="form" :rules="formRules">

      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="voucherName">
            <input-label label="Tên voucher" required/>
            <el-input v-model="form.voucherName" maxlength="50" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item prop="numberVoucherCode">
            <input-label label="Số lượng mã" required/>
            <el-input v-model.number="form.numberVoucherCode"></el-input>
          </el-form-item>
        </el-col>
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
      <el-form-item>
        <input-label label="Các điều kiện áp dụng" optional/>
        <el-select @change="changeCondition" multiple class="full-width" v-model="conditions">
          <el-option v-for="item in voucherConditions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="timeLimit" v-if="conditions.includes('TIME_LIMIT')">
        <input-label label="Chọn khoảng thời gian" required/>
        <el-date-picker
          class="full-width"
          v-model="form.timeLimit"
          type="daterange"
          range-separator="-"
          start-placeholder="Ngày bắt đầu"
          end-placeholder="Ngày kết thúc">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="usageLimit" v-if="conditions.includes('USAGE_LIMIT')">
        <input-label label="Nhập số lần sử dụng tối đa" required/>
        <el-input v-model.number="form.usageLimit" min="0"></el-input>
      </el-form-item>
      <el-form-item prop="storeLimit" v-if="conditions.includes('STORE_LIMIT')">
        <input-label label="Chọn cửa hàng" required/>
        <el-select class="full-width" v-model="form.storeLimit">
          <el-option v-for="item in listStore"
                     :key="item.guid"
                     :label="item.storeCode + ' - ' + item.storeName"
                     :value="item.guid">
          </el-option>
        </el-select>
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
  import AdminStoreService from "@/service/admin/admin.store.service";

  export default {
    name: "CreateOrUpdateVoucherDialog",
    data() {
      return {
        isEdit: false,
        isLoading: false,
        dialogFormVisible: false,
        conditions: [],
        form: {
          guid: null,
          voucherName: null,
          voucherDescription: null,
          voucherImageUrl: null,
          voucherDiscount: null,
          voucherDiscountType: null,
          voucherConditions: null,
          voucherEnable: true,
          numberVoucherCode: null,
          timeCondition: {
            voucherGuid: null,
            validFrom: null,
            validUntil: null,
          },
          usageCondition: {
            voucherGuid: null,
            maxUsage: null,
          },
          storeCondition: {
            voucherGuid: null,
            storeGuid: null,
          },
          timeLimit: [],
          usageLimit: null,
          storeLimit: null,
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
          numberVoucherCode: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: 'blur'},
            {type: 'number', min: 1, message: this.$t("common.entity.validation.min", {min: 1}), trigger: "blur"}
          ]
        },
        voucherDiscountTypes: [
          {label: "Giá trị", value: "VALUE"},
          {label: "Phần trăm", value: "PERCENT"},
        ],
        voucherConditions: [
          {label: "Giới hạn thời gian", value: "TIME_LIMIT"},
          {label: "Giới hạn lượt dùng", value: "USAGE_LIMIT"},
          {label: "Giới hạn cửa hàng", value: "STORE_LIMIT"},
        ],
        listStore: [],
      };
    },
    created() {
    },
    methods: {
      async getAllStore() {
        const {data} = await AdminStoreService.getAllStore();
        this.listStore = data;
      },
      create() {
        this.getAllStore();
        this.isEdit = false;
        this.form = {
          voucherDiscountType: "VALUE",
          voucherEnable: true,
          timeCondition: {},
          usageCondition: {},
          storeCondition: {},
          timeLimit: []
        };
        this.show();
      },
      edit(voucher) {
        this.getAllStore();
        this.isEdit = true;
        this.form = AppUtils.deepCopy(voucher);
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
        this.conditions = [];
        this.listStore = [];
        this.$refs.voucherForm.clearValidate();
        this.$refs.voucherForm.resetFields();
      },
      beforeClose(done) {
        this.resetForm();
        done();
      },
      changeCondition(value) {
        if (value.includes("TIME_LIMIT")) {
          this.formRules.timeLimit = [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: 'blur'},
          ];
        } else {
          this.formRules.timeLimit = [];
        }

        if (value.includes("USAGE_LIMIT")) {
          this.formRules.usageLimit = [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: 'blur'},
            {type: 'number', min: 0, message: this.$t("common.entity.validation.min", {min: 0}), trigger: "blur"}
          ];
        } else {
          this.formRules.usageLimit = [];
        }

        if (value.includes("STORE_LIMIT")) {
          this.formRules.storeLimit = [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: 'blur'},
          ];
        } else {
          this.formRules.storeLimit = [];
        }
      },
      submit() {
        this.$refs.voucherForm.validate(async valid => {
          if (valid) {
            try {
              this.isLoading = true;
              if (this.conditions.includes("TIME_LIMIT")) {
                if (!this.form.timeCondition) this.form.timeCondition = {};
                this.form.timeCondition.validFrom = this.form.timeLimit[0];
                this.form.timeCondition.validUntil = this.form.timeLimit[1];
              }
              if (this.conditions.includes("USAGE_LIMIT")) {
                if (!this.form.usageCondition) this.form.usageCondition = {};
                this.form.usageCondition.maxUsage = this.form.usageLimit;
              }
              if (this.conditions.includes("STORE_LIMIT")) {
                if (!this.form.storeCondition) this.form.storeCondition = {};
                this.form.storeCondition.storeGuid = this.form.storeLimit;
              }
              this.form.voucherConditions = this.conditions.join(";");
              if (!this.isEdit) {
                const {data} = await AdminVoucherService.createVoucher(this.form);
                this.$emit("voucherCreated", data);
              } else {
                const {data} = await AdminVoucherService.updateVoucher(this.form);
                this.$emit("voucherUpdated", data);
              }
              this.isLoading = false;
              this.hide();
              NotificationUtils.success(this.$t("common.entity.save.success"));
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
