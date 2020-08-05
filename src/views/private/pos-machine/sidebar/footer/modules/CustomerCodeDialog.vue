<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    title="Tạo khách hàng thành công"
    :close-on-click-modal="false"
    :before-close="beforeClose"
    :destroy-on-close="true"
    :close-on-press-escape="false"
    :append-to-body="true"
    width="50%"
    :show-close="false"
  >
    <div v-if="customer">
      <ul style="line-height: 32px">
        <li>Mã khách hàng: {{customer.customerCode}}</li>
        <li>Tên khách hàng: {{customer.customerName}}</li>
        <li>SĐT khách hàng: {{customer.customerPhone}}</li>
      </ul>
    </div>
    <el-form ref="dialogForm" :model="form" :rules="formRules">
      <el-form-item prop="message">
        <input-label label="Tin nhắn gửi khách"/>
        <el-input ref="message" type="textarea" rows="6" v-model="form.message"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="copyMessage" type="info">
          <i v-if="!isCopied" class="el-icon-document-copy"></i>
          <i v-else class="el-icon-check"></i>
          <span v-if="!isCopied">Sao chép</span>
          <span v-else>Đã sao chép</span>
        </el-button>
        <el-button :loading="isLoading" :disabled="activated" @click="activateVoucherCode" type="warning">
          <i v-if="!activated" class="el-icon-key"></i>
          <i v-else class="el-icon-check"></i>
          <span v-if="!activated">Kích hoạt mã</span>
          <span v-else>Đã kích hoạt</span>
        </el-button>
        <el-button v-if="activated" :loading="isApplying" :disabled="applied" @click="updatePhoneAndApplyVoucher" type="success">
          <i v-if="!applied" class="el-icon-discount"></i>
          <i v-else class="el-icon-check"></i>
          <span v-if="!applied">Cập nhật SĐT và Áp dụng mã</span>
          <span v-else>Đã áp dụng</span>
        </el-button>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="hide">
        <span>{{$t("common.entity.action.close")}}</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>

  import NotificationUtils from "@/utils/notification.util";
  import PosVoucherCodeService from "@/service/pos/pos.voucher-code.service";
  import PosOrderService from "@/service/pos/pos.order.service";
  import MessageUtils from "@/utils/message.util";
  import {mapState} from "vuex";
  import MessageBoxUtils from "@/utils/message-box.util";

  export default {
    name: "CustomerCodeDialog",
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
        isApplying: false,
        dialogFormVisible: false,
        customer: null,
        isCopied: false,
        activated: false,
        applied: false,
        defaultTemplate: "Mã khách hàng: {code}\n\n" +
          "Bữa Ăn Sạch cảm ơn quý khách đã đăng ký thành viên! QK được tặng 30.000đ sẽ giảm trừ ngay khi thanh toán. " +
          "Các lần sau đến ăn, QK sẽ được tích điểm trên hệ thống.\n\n" +
          "Việc trở thành thành viên của Bữa Ăn Sạch, quý khách sẽ nhận đc tin nhắn thông báo của hệ thống khi có chương trình khuyến mãi.",
        form: {
          message: null,
        },
        formRules: {}
      };
    },
    methods: {
      show(data) {
        this.customer = data;
        this.form.message = this.defaultTemplate.replace("{code}", this.customer.customerCode);
        this.dialogFormVisible = true;
      },
      hide() {
        this.resetForm();
        this.dialogFormVisible = false;
      },
      resetForm() {
        this.$refs.dialogForm.clearValidate();
        this.$refs.dialogForm.resetFields();
        this.customer = null;
        this.activated = false;
        this.applied = false;
        this.isCopied = false;
      },
      beforeClose(done) {
        this.resetForm();
        done();
      },
      async activateVoucherCode() {
        try {
          this.isLoading = true;
          await PosVoucherCodeService.updateVoucherCode({
            voucherCode: this.customer.customerCode,
            voucherCodeClaimStatus: "CLAIMED"
          });
          this.activated = true;
          this.isLoading = false;
        } catch (error) {
          this.isLoading = false;
          NotificationUtils.error("Đã có lỗi xảy ra, vui lòng thử lại");
        }
      },
      copyMessage() {
        this.$refs.message.select();
        document.execCommand("copy");
        this.isCopied = true;
      },
      copyPhone() {
        this.$refs.customerPhone.select();
        document.execCommand("copy");
        this.hide();
      },
      async updatePhoneAndApplyVoucher() {
        if (this.currentOrder.voucherCustomerPhone != null) {
          try {
            await MessageBoxUtils.confirmPromise("Mã voucher đã áp dụng trên đơn sẽ bị hủy và thay thế bằng mã voucher mới!");
          } catch (e) {
            return;
          }
        }
        try {
          this.isApplying = true;
          await this.applyCustomerPhone();
          await this.applyVoucherCode();
          this.isApplying = false;
          this.applied = true;
        } catch (e) {
          this.isApplying = false;
          const message = e.message || e.data.message;
          let errorMsg = "Đã xảy ra lỗi, vui lòng thử lại";
          switch (message) {
            case 'disabled':
              errorMsg = "Mã giảm giá đã bị vô hiệu hóa";
              break;
            case 'invalid':
              errorMsg = "Mã giảm giá không hợp lệ";
              break;
            case 'expired':
              errorMsg = "Mã giảm giá đã hết hạn";
              break;
            case 'maxUsed':
              errorMsg = "Mã giảm giá đã hết lượt sử dụng";
              break;
            case 'invalidStore':
              errorMsg = "Mã giảm giá không hợp lệ";
              break;
          }
          MessageUtils.error(errorMsg);
        }
        await this.$store.dispatch("posMachine/getSeatOrderInfo", this.selectedSeat.guid);
      },
      async applyCustomerPhone() {
        await PosOrderService.changeCustomerPhone({
          seatGuid: this.currentOrder.seatGuid,
          orderGuid: this.currentOrder.guid,
          newCustomerPhone: this.customer.customerPhone
        });
      },
      async applyVoucherCode() {
        let payload = {
          orderGuid: this.currentOrder.guid,
          customerPhone: this.customer.customerPhone,
          voucherCode: this.customer.customerCode,
        };
        await PosVoucherCodeService.applyVoucher(payload);
      }
    }
  };
</script>

<style scoped>

</style>
