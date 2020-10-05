<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    title="Đánh giá & Phản hồi"
    :close-on-click-modal="false"
    :before-close="beforeClose"
    :destroy-on-close="true"
    width="30%"
  >
    <el-form ref="dialogForm" :model="form" :rules="formRules">
      <el-form-item prop="productQualityRating">
        <input-label label="Chất lượng món ăn" required/>
        <el-rate
          :disabled="form.guid != null"
          v-model="form.productQualityRating"
          @change="changeValue"
          :colors="['#566a79', '#e6a23c','#07a651']"
          :icon-classes="iconClasses"
          void-icon-class="fas el-icon-fa-heart"
          disabled-void-icon-class="fas el-icon-fa-heart"
          :texts="['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Rất tốt']"
          show-text>
        </el-rate>
      </el-form-item>

      <!--      <el-form-item prop="serviceQualityRating">-->
      <!--        <input-label label="Chất lượng phục vụ" required/>-->
      <!--        <el-rate-->
      <!--          class="text-very-large"-->
      <!--          v-model="form.serviceQualityRating"-->
      <!--          :texts="['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Rất tốt']"-->
      <!--          show-text>-->
      <!--        </el-rate>-->
      <!--      </el-form-item>-->

      <el-form-item prop="feedbackContent">
        <input-label label="Phản hồi của khách" optional/>
        <el-input :disabled="form.guid != null" type="textarea" rows="3" v-model="form.feedbackContent"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="hide">
        <span>{{$t("common.entity.action.cancel")}}</span>
      </el-button>
      <el-button :disabled="form.guid != null" type="primary" @click="submit" :loading="isLoading">
        <span>{{$t("common.entity.action.save")}}</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {mapState} from "vuex";
  import PosOrderFeedbackService from "@/service/pos/pos.order-feedback.service";
  import MessageUtils from "@/utils/message.util";

  export default {
    name: "OrderFeedbackDialog",
    computed: {
      ...mapState({
        selectedSeat: state => state.posMachine.selectedSeat,
        currentOrder: state => state.posMachine.currentOrder,
      })
    },
    data() {
      return {
        isEdit: false,
        isLoading: false,
        dialogFormVisible: false,
        iconClasses: ['fas el-icon-fa-heart', 'fas el-icon-fa-heart', 'fas el-icon-fa-heart'],
        form: {
          guid: null,
          orderGuid: null,
          storeGuid: null,
          orderFeedbackAction: "SUBMIT", // CANCEL, SUBMIT
          serviceQualityRating: null,
          productQualityRating: null,
          feedbackContent: null,
        },
        formRules: {
          productQualityRating: [
            {type: 'number', min: 1, message: "Vui lòng chọn một mức đánh giá", trigger: "change"}
          ]
        },
        qualityValues: {
          VERY_BAD: 1,
          BAD: 2,
          NORMAL: 3,
          GOOD: 4,
          VERY_GOOD: 5,
        },
        valueOfQualities: {
          1: "VERY_BAD",
          2: "BAD",
          3: "NORMAL",
          4: "GOOD",
          5: "VERY_GOOD",
        }
      };
    },
    methods: {
      changeValue() {
        this.$refs.dialogForm.validate();
      },
      async show() {
        const {data} = await PosOrderFeedbackService.getFeedback(this.currentOrder.guid);
        if (data.guid) {
          this.form = data;
          this.form.productQualityRating = this.qualityValues[this.form.productQualityRating];
          this.form.serviceQualityRating = this.qualityValues[this.form.serviceQualityRating];
        }
        this.dialogFormVisible = true;
      },
      hide() {
        this.resetForm();
        this.dialogFormVisible = false;
      },
      resetForm() {
        this.$refs.dialogForm.clearValidate();
        this.$refs.dialogForm.resetFields();
        this.form = {
          orderFeedbackAction: "SUBMIT"
        };
      },
      beforeClose(done) {
        this.resetForm();
        done();
      },
      submit() {
        this.$refs.dialogForm.validate(async valid => {
          if (valid) {
            let payload = {
              ...this.form
            };
            payload.orderGuid = this.currentOrder.guid;
            payload.storeGuid = this.$route.params.storeGuid;
            payload.productQualityRating = this.valueOfQualities[this.form.productQualityRating];
            payload.serviceQualityRating = this.valueOfQualities[this.form.serviceQualityRating];
            try {
              this.isLoading = true;
              await PosOrderFeedbackService.sendFeedback(payload);
              MessageUtils.success("Lưu phản hồi thành công");
              this.isLoading = false;
              this.hide();
            } catch (error) {
              this.isLoading = false;
              MessageUtils.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
            }
          }
        });
      },
    }
  };
</script>

<style scoped>
  /deep/ .el-rate__icon {
    font-size: 24px;
    padding: 0 5px
  }

  /deep/ .el-rate__text {
    padding-left: 20px;
  }

  /deep/ .el-rate {
    height: 32px;
  }
</style>
