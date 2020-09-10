<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    title="Tạo hoặc cập nhật khuyến mãi"
    :close-on-click-modal="false"
    :before-close="beforeClose"
    :destroy-on-close="true"
  >

    <el-form ref="dialogForm" :model="form" :rules="formRules">
      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="saleName">
            <input-label label="Tên Sale" required/>
            <el-input v-model="form.saleName" maxlength="255" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item prop="saleNameEng">
            <input-label label="Tên Sale (Tiếng Anh)" required/>
            <el-input v-model="form.saleNameEng" maxlength="255" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="saleDiscountType">
            <input-label label="Loại giảm giá" optional/>
            <el-select class="full-width" v-model="form.saleDiscountType">
              <el-option v-for="item in discountTypes"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item prop="saleDiscount">
            <input-label label="Giảm giá" required/>
            <el-input v-model.number="form.saleDiscount"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item prop="saleActivated">
        <el-checkbox v-model="form.saleActivated">
          <span>Kích hoạt</span>
        </el-checkbox>
      </el-form-item>

      <el-form-item>
        <input-label label="Các điều kiện áp dụng" optional/>
        <el-select @change="selectChange" multiple class="full-width" v-model="form.conditions">
          <el-option v-for="item in saleConditionOption"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="dateRange" v-if="form.conditions.includes(saleConditionValue.TIME_LIMIT)">
        <input-label label="Chọn khoảng thời gian" required/>
        <el-date-picker
          class="full-width"
          v-model="form.dateRange"
          format="dd/MM/yyyy"
          type="daterange"
          range-separator="-"
          start-placeholder="Ngày bắt đầu"
          end-placeholder="Ngày kết thúc">
        </el-date-picker>
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
  import NotificationUtils from '@/utils/notification.util';
  import DiscountType from '@/enum/DiscountType';
  import SaleCondition from '@/enum/SaleCondition';
  import AdminSaleService from '@/service/admin/admin.sale.service';

  export default {
    name: 'CreateOrUpdateSaleDialog',
    data() {
      return {
        isEdit: false,
        isLoading: false,
        dialogFormVisible: false,
        discountTypes: DiscountType.optionArray,
        saleConditionOption: SaleCondition.optionArray,
        saleConditionValue: SaleCondition.value,
        form: {
          guid: null,
          saleName: null,
          saleNameEng: null,
          saleDescription: null,
          saleDescriptionEng: null,
          saleImageUrl: null,
          saleDiscount: null,
          saleDiscountType: null,
          saleConditions: null,
          saleActivated: null,
          timeCondition: null,
          dateRange: [],
          conditions: [],
        },
        formRules: {
          saleName: [
            {required: true, message: this.$t('common.entity.validation.required'), trigger: 'blur'},
          ],
          saleNameEng: [
            {required: true, message: this.$t('common.entity.validation.required'), trigger: 'blur'},
          ],
          saleDiscount: [
            {required: true, message: this.$t('common.entity.validation.required'), trigger: 'blur'},
          ],
          saleDiscountType: [
            {required: true, message: this.$t('common.entity.validation.required'), trigger: 'blur'},
          ],
        },
      };
    },
    methods: {
      create() {
        this.isEdit = false;
        this.form = {
          saleDiscountType: DiscountType.value.PERCENT,
          saleActivated: true,
          dateRange: [],
          conditions: [],
        };
        this.show();
      },
      edit(entity) {
        this.isEdit = true;
        this.form = {
          dateRange: [],
          conditions: [],
          ...AppUtils.deepCopy(entity),
        };
        this.form.conditions = this.form.conditions.concat(this.form.saleConditions.split(';'));
        if (this.form.timeCondition) {
          this.form.dateRange = [this.form.timeCondition.validFrom, this.form.timeCondition.validUntil];
        }
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
      getPayload() {
        if (this.form.conditions.includes(this.saleConditionValue.TIME_LIMIT)) {
          if (this.form.timeCondition == null) this.form.timeCondition = {};
          this.form.timeCondition.validFrom = this.form.dateRange[0];
          let validUntil = new Date(this.form.dateRange[1]);
          validUntil.setHours(23, 59, 59, 0);
          this.form.timeCondition.validUntil = validUntil;
        } else {
          this.form.timeCondition = null;
        }
        this.form.saleConditions = this.form.conditions.join(';');
        return this.form;
      },
      selectChange() {
      },
      submit() {
        this.$refs.dialogForm.validate(async valid => {
          if (valid) {
            try {
              this.isLoading = true;
              const payload = this.getPayload();
              if (this.isEdit) {
                await AdminSaleService.updateSale(payload);
              } else {
                await AdminSaleService.createSale(payload);
              }
              this.$emit('saved');
              this.hide();
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
