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
    <el-form ref="dialogForm" :model="form" :rules="formRules" v-loading="isLoading">
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
  import PosVoucherService from "@/service/pos/pos.voucher.service";

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
        defaultTemplate: "Chuỗi cửa hàng Bữa Ăn Sạch gửi tặng quý khách mã giảm giá {value}.\n\n" +
          "(Mã sử dụng được 1 lần và áp dụng khi thanh toán cùng với số điện thoại nhận được tin nhắn)\n\n" +
          "Mã khuyến mãi là: {code}",
        form: {
          message: null,
        },
        formRules: {}
      };
    },
    methods: {
      show(data) {
        this.customer = data;
        this.dialogFormVisible = true;
        this.getFirstRegisterVoucherInfo();
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
      async getFirstRegisterVoucherInfo() {
        try {
          this.isLoading = true;
          const {data} = await PosVoucherService.getFirstRegisterVoucher();
          this.form.message = data.voucherDescription.replace("{code}", this.customer.customerCode);
        } catch (e) {
          this.form.message = this.defaultTemplate.replace("{code}", this.customer.customerCode);
          MessageUtils.error("Lấy thông tin voucher thất bại");
        } finally {
          this.isLoading = false;
        }
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
