<template>
  <el-container direction="vertical">
    <div>
      <el-row type="flex" align="top" class="text-normal padding-bottom-10">
        <div>
          <el-tag>
            <span>Voucher đăng ký lần đầu</span>
          </el-tag>
        </div>
        <div class="padding-left-10">
          <el-tag>
            <span>Giảm giá: </span>
            <span v-if="firstRegisterVoucher.voucherDiscountType === 'VALUE'">{{firstRegisterVoucher.voucherDiscount | priceAppend}}</span>
            <span v-if="firstRegisterVoucher.voucherDiscountType === 'PERCENT'">{{firstRegisterVoucher.voucherDiscount}}%</span>
          </el-tag>
        </div>
        <div class="padding-left-10">
          <el-tag>
            <span>Loại giảm giá: </span>
            <span v-if="firstRegisterVoucher.voucherDiscountType === 'VALUE'">Giá trị</span>
            <span v-if="firstRegisterVoucher.voucherDiscountType === 'PERCENT'">Phần trăm</span>
          </el-tag>
        </div>
      </el-row>
      <el-row type="flex" align="top">
        <el-col :md="20" :xs="20">
          <div>
            <el-input ref="messageTemplate" :readonly="!isEdit" type="textarea" rows="5" v-model="messageComputed"
                      placeholder="Mẫu tin nhắn gửi khách">
            </el-input>
          </div>
        </el-col>
        <el-col :md="4" :xs="4" class="padding-left-10">
          <div v-if="isEdit">
            <el-button class="full-width" size="small" type="success" @click="saveMessageTemplate">
              <i class="fas el-icon-fa-save"></i>
              <span class="hidden-xs-only">Lưu</span>
            </el-button>
          </div>
          <div class="padding-top-10" v-if="isEdit">
            <el-button class="full-width" size="small" @click="cancelEditMessageTemplate" type="info">
              <i class="el-icon-close"></i>
              <span class="hidden-xs-only">Hủy</span>
            </el-button>
          </div>
          <template v-else>
            <div>
              <el-button class="full-width" type="warning" size="small" @click="editMessage">
                <i class="el-icon-edit"></i>
                <span class="hidden-xs-only">Đổi mẫu</span>
              </el-button>
            </div>
            <div class="padding-top-10">
              <el-button class="full-width" size="small" @click="resetTemplate">
                <i class="el-icon-refresh-right"></i>
                <span class="hidden-xs-only">Mặc định</span>
              </el-button>
            </div>
            <div class="padding-top-10">
              <el-popover
                placement="bottom"
                width="200"
                trigger="click">
                <el-button slot="reference" class="full-width" type="info" size="small">
                  <i class="el-icon-help"></i>
                  <span class="hidden-xs-only">Hướng dẫn</span>
                </el-button>
                <div>
                  <el-row class="padding-bottom-5" type="flex" align="middle">
                    <el-tag size="medium">{value}</el-tag>
                    <span class="padding-left-10">Giá trị voucher</span>
                  </el-row>
                  <el-row class="padding-bottom-5" type="flex" align="middle">
                    <el-tag size="medium">{code}</el-tag>
                    <span class="padding-left-10">Mã voucher code</span>
                  </el-row>
                  <el-row class="padding-bottom-5" type="flex" align="middle">
                    <el-tag size="medium">{phone}</el-tag>
                    <span class="padding-left-10">Số điện thoại khách</span>
                  </el-row>
                </div>
              </el-popover>
            </div>
          </template>
        </el-col>
      </el-row>
      <el-row class="padding-top-10">
        <el-col class="text-right">
          <el-button
            size="small"
            :loading="isLoading"
            @click="getUnsentVoucher"
            icon="el-icon-refresh">
            <span>{{ $t("common.entity.action.refresh") }}</span>
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="margin-top-10">
      <raw-data-table highlight-current-row :data="listUnsentVoucher" show-audit :custom-audit="['createdDate']">
        <el-table-column width="190px" prop="customerPhone" label="SĐT Khách">
          <template slot-scope="{row}">
            <el-row :gutter="10" type="flex" align="middle">
              <el-col>
                <el-input size="small" :ref="row.customerPhone" readonly v-model="row.customerPhone"></el-input>
              </el-col>
              <el-button size="small" @click="copyCustomerPhone(row)">
                <span>Copy</span>
              </el-button>
            </el-row>
          </template>
        </el-table-column>
        <!--        <el-table-column prop="customerName" label="Tên khách hàng"></el-table-column>-->
        <el-table-column width="130px" prop="customerZaloStatus" label="Trạng thái Zalo">
          <template slot-scope="{row}">
            <el-select size="small" @change="updateCustomer(row)" v-model="row.customerZaloStatus">
              <el-option v-for="status in customerZaloStatus"
                         :key="status.value"
                         :value="status.value"
                         :label="status.label"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column width="225px" prop="voucherCode" label="Mã voucher">
          <template slot-scope="{row}">
            <el-row :gutter="10" type="flex" align="middle">
              <el-col>
                <span>{{row.voucherCode | uppercase}}</span>
              </el-col>
              <el-col>
                <el-button @click="copyMessage(row)" type="success" plain size="small">
                  <span>Copy + Tin nhắn</span>
                </el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column width="200px" prop="voucherCodeClaimStatus" label="Thao tác">
          <template slot-scope="{row}" v-show="row.voucherCodeClaimStatus === 'UNSET'">
            <el-tooltip content="Mã sẽ được kích hoạt">
              <el-button :loading="row.isSending" @click="updateVoucher(row, 'CLAIMED')" type="success"
                         size="small">
                <span>Đã gửi</span>
              </el-button>
            </el-tooltip>
            <el-tooltip content="Mã sẽ bị vô hiệu hóa">
              <el-button :loading="row.isSending" @click="updateVoucher(row, 'ARCHIVED')" type="info" size="small">
                <span>Lưu trữ</span>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </raw-data-table>
    </div>
  </el-container>
</template>

<script>
  import CustomerCareCustomerVoucherCodeService
    from "@/service/customer-care/customer-care.customer-voucher-code.service";
  import CustomerCareVoucherCodeService from "@/service/customer-care/customer-care.voucher-code.service";
  import NotificationUtils from "@/utils/notification.util";
  import RawDataTable from "@/components/raw-table-data/RawDataTable";
  import CustomerCareCustomerService from "@/service/customer-care/customer-care.customer.service";
  import MessageUtils from "@/utils/message.util";
  import PosVoucherService from "@/service/pos/pos.voucher.service";

  export default {
    name: "ListUnsentVoucher",
    components: {RawDataTable},
    data() {
      return {
        isEdit: false,
        isLoading: false,
        defaultTemplate: "Chuỗi cửa hàng Bữa Ăn Sạch gửi tặng quý khách mã khuyến mãi {value}\n\n" +
          "(Áp dụng khi thanh toán cùng với số điện thoại nhận được tin nhắn)\n\n" +
          "Mã khuyến mãi: {code}\n\n" +
          "Quý khách vui lòng đọc số điện thoại và mã khuyến mãi cho nhân viên để áp dụng.\n\n" +
          "Cảm ơn quý khách!",
        messageTemplate: localStorage.getItem("messageTemplate") ? JSON.parse(localStorage.getItem("messageTemplate")) : "Chuỗi cửa hàng Bữa Ăn Sạch gửi tặng quý khách mã khuyến mãi {value}\n\n" +
          "(Áp dụng khi thanh toán cùng với số điện thoại nhận được tin nhắn)\n\n" +
          "Mã khuyến mãi: {code}\n\n" +
          "Quý khách vui lòng đọc số điện thoại và mã khuyến mãi cho nhân viên để áp dụng.\n\n" +
          "Cảm ơn quý khách!",
        messageComputed: null,
        discountValue: "",
        customerZaloStatus: [
          {label: "Chưa biết", value: "UNKNOWN"},
          {label: "Có Zalo", value: "EXIST"},
          {label: "Không có Zalo", value: "NOT_EXIST"},
        ],
        voucherCodeClaimStatus: [
          {label: "Chưa đặt", value: "UNSET"},
          {label: "Đã gửi", value: "CLAIMED"},
          {label: "Đã lưu trữ", value: "ARCHIVED"},
        ],
        listUnsentVoucher: [],
        firstRegisterVoucher: {}
      };
    },
    async created() {
      await this.getFirstRegisterVoucherInfo();
      this.getUnsentVoucher();
      this.messageComputed = this.messageTemplate;
    },
    methods: {
      async getFirstRegisterVoucherInfo() {
        try {
          const {data} = await PosVoucherService.getFirstRegisterVoucher();
          this.firstRegisterVoucher = data;
          switch (this.firstRegisterVoucher.voucherDiscountType) {
            case "VALUE":
              this.discountValue = this.formatPrice(this.firstRegisterVoucher.voucherDiscount);
              break;
            case "PERCENT":
              this.discountValue = this.firstRegisterVoucher.voucherDiscount + "%";
              break;
          }
        } catch (e) {
          MessageUtils.error("Lấy thông tin voucher thất bại");
        }
      },
      formatPrice(value, unit) {
        if (unit) unit = " " + unit;
        else unit = "₫";
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + unit;
      },
      resetTemplate() {
        localStorage.removeItem("messageTemplate");
        this.messageTemplate = this.defaultTemplate;
        this.messageComputed = this.defaultTemplate;
      },
      hideRow(row) {
        const idx = this.listUnsentVoucher.findIndex(item => item.customerPhone === row.customerPhone);
        this.listUnsentVoucher.splice(idx, 1);
      },
      copyCustomerPhone(row) {
        const vm = this;
        setTimeout(function () {
          vm.$refs[row.customerPhone].select();
          document.execCommand("copy");
          MessageUtils.success("Đã copy");
        }, 10);
      },
      copyMessage(row) {
        const vm = this;
        this.computedMessage(row);
        setTimeout(function () {
          vm.$refs.messageTemplate.select();
          document.execCommand("copy");
          MessageUtils.success("Đã copy");
        }, 100);
      },
      editMessage() {
        this.isEdit = true;
        this.messageComputed = this.messageTemplate;
      },
      saveMessageTemplate() {
        this.isEdit = false;
        this.messageTemplate = this.messageComputed;
        localStorage.setItem("messageTemplate", JSON.stringify(this.messageComputed));
      },
      cancelEditMessageTemplate() {
        this.messageTemplate = localStorage.getItem("messageTemplate") ? JSON.parse(localStorage.getItem("messageTemplate")) : this.messageTemplate;
        this.messageComputed = this.messageTemplate;
        this.isEdit = false;
      },
      computedMessage(row) {
        let temp = this.messageTemplate;
        temp = temp.replace("{value}", this.discountValue);
        temp = temp.replace("{phone}", row.customerPhone);
        temp = temp.replace("{code}", row.voucherCode.toUpperCase());
        this.messageComputed = temp;
      },
      async getUnsentVoucher() {
        try {
          this.isLoading = true;
          const {data} = await CustomerCareCustomerVoucherCodeService.getUnsentVoucher();
          this.isLoading = false;
          this.listUnsentVoucher = data;
        } catch (error) {
          this.isLoading = false;
          NotificationUtils.error("Đã có lỗi xảy ra, vui lòng thử lại");
        }
      },
      async updateVoucher(row, status) {
        try {
          this.$set(row, 'isSending', true);
          await CustomerCareVoucherCodeService.updateVoucherCode({
            voucherCode: row.voucherCode,
            voucherCodeClaimStatus: status
          });
          this.$set(row, 'isSending', false);
          this.hideRow(row);
        } catch (error) {
          this.$set(row, 'isSending', false);
          NotificationUtils.error("Đã có lỗi xảy ra, vui lòng thử lại");
        }
      },
      async updateCustomer(row) {
        try {
          await CustomerCareCustomerService.updateCustomer({
            customerPhone: row.customerPhone,
            customerZaloStatus: row.customerZaloStatus
          });
        } catch (e) {
          NotificationUtils.error("Đã có lỗi xảy ra, vui lòng thử lại");
        }
      }
    }
  };
</script>

<style scoped>

</style>
