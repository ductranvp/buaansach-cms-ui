<template>
  <el-container direction="vertical">
    <div>
      <el-row type="flex" align="top" justify="end">
        <el-col :span="20">
          <el-row type="flex" align="top">
            <el-row>
              <el-tag>{code}: Mã code</el-tag>
              <el-tag>{phone}: Số điện thoại</el-tag>
            </el-row>
            <el-col>
              <div>
                <el-input ref="messageTemplate" :readonly="!isEdit" type="textarea" rows="5" v-model="messageComputed"
                          placeholder="Mẫu tin nhắn gửi khách">
                </el-input>
              </div>
            </el-col>
            <div class="padding-left-10">
              <div v-if="isEdit">
                <el-button type="success" @click="saveMessageTemplate">Lưu</el-button>
              </div>
              <div class="padding-top-10" v-if="isEdit">
                <el-button @click="cancelEditMessageTemplate" type="info">Hủy</el-button>
              </div>
              <template v-else>
                <div>
                  <el-button @click="isEdit = true">Đổi mẫu</el-button>
                </div>
                <div class="padding-top-10">
                  <el-button @click="resetTemplate">Reset</el-button>
                </div>
              </template>
            </div>
          </el-row>
        </el-col>
        <el-col :span="4" class="text-right">
          <el-button
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
        <el-table-column width="300px" prop="customerPhone" label="SĐT Khách">
          <template slot-scope="{row}">
            <el-row :gutter="10" type="flex" align="middle">
              <el-col>
                <el-input size="small" :ref="row.customerPhone" readonly v-model="row.customerPhone"></el-input>
              </el-col>
              <el-col>
                <el-button size="small" @click="copyCustomerPhone(row)">Copy</el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--        <el-table-column prop="customerName" label="Tên khách hàng"></el-table-column>-->
        <el-table-column prop="customerZaloStatus" label="Trạng thái Zalo">
          <template slot-scope="{row}">
            <el-select size="small" @change="updateCustomer(row)" v-model="row.customerZaloStatus">
              <el-option v-for="status in customerZaloStatus"
                         :key="status.value"
                         :value="status.value"
                         :label="status.label"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="voucherCode" label="Mã voucher">
          <template slot-scope="{row}">
            <el-row :gutter="10" type="flex" align="middle">
              <el-col>
                <span>{{row.voucherCode}}</span>
              </el-col>
              <el-col>
                <el-button @click="copyMessage(row)" v-if="!row.voucherCodeSent" type="success" plain size="small">
                  <span>Copy + Tin nhắn</span>
                </el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="voucherCodeSentStatus" label="Thao tác">
          <template slot-scope="{row}" v-show="row.voucherCodeSentStatus === 'UNSET'">
            <el-button :loading="row.isSending" @click="updateVoucher(row, 'SENT')" type="success" plain
                       size="small">
              <span>Đã gửi</span>
            </el-button>
            <el-button :loading="row.isSending" @click="updateVoucher(row, 'ARCHIVED')" type="info" plain size="small">
              <span>Lưu trữ</span>
            </el-button>
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

  export default {
    name: "ListUnsentVoucher",
    components: {RawDataTable},
    data() {
      return {
        isEdit: false,
        messageTemplate: localStorage.getItem("messageTemplate") ? JSON.parse(localStorage.getItem("messageTemplate")) : "Chuỗi cửa hàng Bữa Ăn Sạch gửi tặng quý khách mã giảm giá 30k.\n" +
          "(Áp dụng khi thanh toán với số điện thoại của quý khách)\n" +
          "Mã giảm giá: {code}\n" +
          "Quý khách vui lòng đưa nhân viên xem tin nhắn để sử dụng mã.\n" +
          "Cảm ơn quý khách!",
        messageComputed: null,
        isLoading: false,
        customerZaloStatus: [
          {label: "Chưa biết", value: "UNKNOWN"},
          {label: "Có Zalo", value: "EXIST"},
          {label: "Không có Zalo", value: "NOT_EXIST"},
        ],
        voucherCodeSentStatus: [
          {label: "Chưa đặt", value: "UNSET"},
          {label: "Đã gửi", value: "SENT"},
          {label: "Đã lưu trữ", value: "ARCHIVED"},
        ],
        listUnsentVoucher: []
      };
    },
    created() {
      this.getUnsentVoucher();
      this.messageComputed = this.messageTemplate;
    },
    methods: {
      resetTemplate() {
        this.messageComputed = this.messageTemplate;
        localStorage.setItem("messageTemplate", JSON.stringify(this.messageComputed));
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
      saveMessageTemplate() {
        localStorage.setItem("messageTemplate", JSON.stringify(this.messageComputed));
        this.messageTemplate = this.messageComputed;
        this.isEdit = false;
      },
      cancelEditMessageTemplate() {
        this.messageTemplate = JSON.parse(localStorage.getItem("messageTemplate"));
        this.messageComputed = this.messageTemplate;
        this.isEdit = false;
      },
      computedMessage(row) {
        let temp = this.messageTemplate;
        temp = temp.replace("{phone}", row.customerPhone);
        temp = temp.replace("{code}", row.voucherCode);
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
            voucherCodeSentStatus: status
          });
          this.$set(row, 'isSending', false);
          this.hideRow(row);
          NotificationUtils.success("Cập nhật thành công");
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
