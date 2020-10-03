<template>
  <el-container direction="vertical">
    <el-row type="flex" align="middle" justify="end">
      <el-col>
        <el-button type="primary" plain>Kho mã: {{inventory.totalCode}}</el-button>
        <el-button type="primary" plain>Đã lấy ra: {{inventory.totalCode - inventory.remainCode}}</el-button>
        <el-button type="primary" plain>Còn lại: {{inventory.remainCode}}</el-button>
        <el-button type="primary" @click="generateVoucherInventory">Sinh mã code</el-button>
      </el-col>
      <el-button type="primary" @click="createVoucher">Tạo mới</el-button>
    </el-row>
    <el-row class="margin-top-10">
      <raw-data-table ref="voucherTable"
                      :data="listVoucher">
        <template slot="expand">
          <el-table-column type="expand">
            <template slot-scope="{row}">
              <admin-voucher-row-detail :row="row"/>
            </template>
          </el-table-column>
        </template>

        <el-table-column label="Tên Voucher" prop="voucherName"></el-table-column>

        <el-table-column label="Giới hạn thời gian">
          <template slot-scope="{row}">
            <el-tag size="medium" v-if="row.timeCondition">
              <span>{{row.timeCondition.validFrom | moment("DD/MM/YY")}} - {{row.timeCondition.validUntil | moment("DD/MM/YY")}}</span>
            </el-tag>
            <el-tag size="medium" v-else>Không</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Giới hạn lượt dùng">
          <template slot-scope="{row}">
            <el-tag size="medium" v-if="row.usageCondition">
              <span>{{row.usageCondition.maxUsage}}</span>
            </el-tag>
            <el-tag size="medium" v-else>Không</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Giới hạn cửa hàng">
          <template slot-scope="{row}">
            <el-tag size="medium" v-if="row.storeCondition">
              <span>{{listStore.find(store => store.guid === row.storeCondition.storeGuid).storeCode}} - </span>
              <span>{{listStore.find(store => store.guid === row.storeCondition.storeGuid).storeName}}</span>
            </el-tag>
            <el-tag size="medium" v-else>Không</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Trạng thái" prop="voucherEnable">
          <template slot-scope="{row}">
            <el-button size="mini" type="success" @click="toggleVoucher(row)" v-if="row.voucherEnable">Đã kích hoạt
            </el-button>
            <el-button size="mini" type="danger" @click="toggleVoucher(row)" v-else>Đã khóa</el-button>
          </template>
        </el-table-column>

        <el-table-column label="Số lượng mã" prop="numberVoucherCode">
        </el-table-column>

        <el-table-column label="Giảm giá" prop="voucherDiscount">
          <template slot-scope="{row}">
            <span v-if="row.voucherDiscountType === 'VALUE'">{{row.voucherDiscount | priceAppend}}</span>
            <span v-else>{{row.voucherDiscount}}%</span>
          </template>
        </el-table-column>

        <template slot="action">
          <el-table-column label="Thao tác">
            <template slot-scope="{row}">
              <el-row type="flex" align="middle">
                <el-button type="primary" size="mini" @click="viewVoucherCode(row)">Xem</el-button>
                <el-button type="warning" size="mini" @click="updateVoucher(row)">Sửa</el-button>
              </el-row>
            </template>
          </el-table-column>
        </template>
      </raw-data-table>
    </el-row>
    <admin-update-voucher-basic @voucherUpdatedBasic="voucherUpdatedBasic" ref="updateVoucherDialog"/>
    <create-or-update-voucher-dialog @voucherCreated="onVoucherCreated" ref="voucherDialog"/>
    <list-voucher-code-dialog ref="listVoucherCodeDialog"/>
    <generate-voucher-inventory-dialog @inventoryUpdated="getVoucherInventoryStatus" ref="voucherInventoryDialog"/>
  </el-container>
</template>

<script>
  import RawDataTable from "@/components/raw-table-data/RawDataTable";
  import NotificationUtils from "@/utils/notification.util";
  import AdminVoucherService from "@/service/admin/admin.voucher.service";
  import CreateOrUpdateVoucherDialog from "@/views/private/admin/voucher/CreateOrUpdateVoucherDialog";
  import ListVoucherCodeDialog from "@/views/private/admin/voucher/ListVoucherCodeDialog";
  import GenerateVoucherInventoryDialog from "@/views/private/admin/voucher/GenerateVoucherInventoryDialog";
  import AdminVoucherInventoryService from "@/service/admin/admin.voucher-inventory.service";
  import AdminStoreService from "@/service/admin/admin.store.service";
  import AdminUpdateVoucherBasic from "@/views/private/admin/voucher/AdminUpdateVoucherBasic";
  import AdminVoucherRowDetail from "@/views/private/admin/voucher/AdminVoucherRowDetail";

  export default {
    name: "AdminVoucher",
    components: {
      AdminVoucherRowDetail,
      AdminUpdateVoucherBasic,
      GenerateVoucherInventoryDialog, ListVoucherCodeDialog, CreateOrUpdateVoucherDialog, RawDataTable
    },
    data() {
      return {
        listVoucher: [],
        listStore: [],
        voucherConditions: {
          TIME_LIMIT: "TIME_LIMIT",
          USAGE_LIMIT: "USAGE_LIMIT"
        },
        inventory: {
          totalCode: null,
          remainCode: null,
        }
      };
    },
    created() {
      // this.getAllStore();
      // this.getListVoucher();
      // this.getVoucherInventoryStatus();
    },
    methods: {
      async getAllStore() {
        const {data} = await AdminStoreService.getAllStore();
        this.listStore = data;
      },
      onVoucherCreated(voucher) {
        this.listVoucher.push(voucher);
        this.getVoucherInventoryStatus();
      },
      createVoucher() {
        this.$refs.voucherDialog.create();
      },
      voucherUpdatedBasic(voucher) {
        const idx = this.listVoucher.findIndex(item => item.guid === voucher.guid);
        this.listVoucher[idx].voucherName = voucher.voucherName;
        this.listVoucher[idx].voucherDescription = voucher.voucherDescription;
        this.listVoucher[idx].voucherDiscount = voucher.voucherDiscount;
        this.listVoucher[idx].voucherDiscountType = voucher.voucherDiscountType;
        this.listVoucher.splice(idx, 1, this.listVoucher[idx]);
      },
      updateVoucher(row) {
        this.$refs.updateVoucherDialog.edit(row);
      },
      generateVoucherInventory() {
        this.$refs.voucherInventoryDialog.create();
      },
      async getVoucherInventoryStatus() {
        try {
          const {data} = await AdminVoucherInventoryService.getVoucherInventoryStatus();
          this.inventory = data;
        } catch (error) {
          NotificationUtils.error(error.message || error.data.message);
        }
      },
      async getListVoucher() {
        try {
          const {data} = await AdminVoucherService.getListVoucher();
          this.listVoucher = data;
        } catch (error) {
          NotificationUtils.error(error.message || error.data.message);
        }
      },
      async toggleVoucher(row) {
        try {
          await AdminVoucherService.toggleVoucher(row.guid);
          row.voucherEnable = !row.voucherEnable;
          // NotificationUtils.success(this.$t("common.entity.save.success"));
        } catch (error) {
          NotificationUtils.error(error.message || error.data.message);
        }
      },
      viewVoucherCode(row) {
        this.$refs.listVoucherCodeDialog.show(row.guid);
      }
    }
  };
</script>

<style scoped>

</style>
