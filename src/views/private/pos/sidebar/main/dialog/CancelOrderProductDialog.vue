<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    title="Hủy món"
    :close-on-click-modal="false"
    :before-close="beforeClose"
    :destroy-on-close="true"
    width="30%"
  >
    <el-form ref="dialogForm" :model="form" :rules="formRules">
      <el-form-item prop="selectReason">
        <input-label label="Lí do hủy món" required/>
        <el-radio-group v-model="form.selectReason" @change="changeReason">
          <el-radio v-for="key in Object.keys(instantReasons)" :label="instantReasons[key]" :key="key">
            <span>{{instantReasons[key]}}</span>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="inputReason" v-if="form.selectReason === instantReasons.OTHER">
        <input-label label="Nhập lý do khác tại đây" required/>
        <el-input :disabled="form.selectReason !== instantReasons.OTHER" type="textarea" rows="3"
                  v-model="form.inputReason"></el-input>
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

  import MessageUtils from "@/utils/message.util";
  import {mapState} from "vuex";

  export default {
    name: "CancelOrderProductDialog",
    computed: {
      ...mapState({
        selectedSeat: state => state.posMachine.selectedSeat,
      })
    },
    data() {
      return {
        isEdit: false,
        isLoading: false,
        dialogFormVisible: false,
        orderProduct: null,
        cancelReason: null,
        instantReasons: {
          PRODUCT_UNAVAILABLE: "Sản phẩm đã hết hàng",
          EMPLOYEE_ERROR: "Nhân viên thao tác nhầm",
          CUSTOMER_ERROR_1: "Khách gọi nhầm",
          CUSTOMER_ERROR_2: "Khách đổi ý không ăn nữa",
          OTHER: "Khác"
        },
        form: {
          selectReason: null,
          inputReason: null,
        },
        formRules: {
          selectReason: [{required: true, message: this.$t("common.entity.validation.required"), trigger: 'blur'}]
        }
      };
    },
    methods: {
      show(orderProduct) {
        this.orderProduct = orderProduct;
        this.dialogFormVisible = true;
      },
      hide() {
        this.resetForm();
        this.dialogFormVisible = false;
      },
      resetForm() {
        this.$refs.dialogForm.clearValidate();
        this.$refs.dialogForm.resetFields();
        this.orderProduct = null;
        this.cancelReason = null;
      },
      beforeClose(done) {
        this.resetForm();
        done();
      },
      changeReason(value) {
        if (value === this.instantReasons.OTHER) {
          this.formRules = {
            selectReason: [{required: true, message: this.$t("common.entity.validation.required"), trigger: 'blur'}],
            inputReason: [{required: true, message: this.$t("common.entity.validation.required"), trigger: 'blur'}],
          };
        } else {
          this.formRules = {
            selectReason: [{required: true, message: this.$t("common.entity.validation.required"), trigger: 'blur'}]
          };
          this.$refs.dialogForm.clearValidate();
        }
      },
      submit() {
        const vm = this;
        this.$refs.dialogForm.validate(async valid => {
          if (valid) {
            if (vm.form.selectReason === vm.instantReasons.OTHER) {
              vm.cancelReason = vm.form.inputReason;
            } else {
              vm.cancelReason = vm.form.selectReason;
            }

            if (vm.$route.params.storeGuid) {
              try {
                const payload = {
                  orderProduct: vm.orderProduct,
                  cancelReason: vm.cancelReason,
                  storeGuid: vm.$route.params.storeGuid
                };
                await vm.$store.dispatch("posMachine/cancelOrderProduct", payload);
                MessageUtils.success("Hủy món thành công");
                vm.hide();
                await vm.$store.dispatch("posMachine/getSeatOrderInfo", vm.selectedSeat.guid);
              } catch (e) {
                MessageUtils.error("Đã xảy ra lỗi, vui lòng thử lại sau");
              }
            }

          }
        });
      },
    }
  };
</script>

<style scoped>
  /deep/ .el-radio {
    line-height: 30px;
    display: block;
  }

  /deep/ .el-form-item {
    margin-bottom: 10px;
  }
</style>
