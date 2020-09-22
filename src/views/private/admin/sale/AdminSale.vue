<template>
  <el-container>
    <create-or-update-sale-dialog ref="saleDialog" @saved="getListSale" />
    <assign-sale-dialog ref="assignSaleDialog" />
    <el-header>
      <el-row class="text-right">
        <el-button type="primary" @click="createSale">Tạo Mới</el-button>
      </el-row>
    </el-header>
    <el-main>
      <raw-data-table :data="sales" show-index>
        <el-table-column prop="saleName" label="Tên Sale"/>
        <el-table-column prop="saleNameEng" label="Tên Sale (Eng)"/>
        <el-table-column prop="saleDiscount" label="Giảm giá"/>
        <el-table-column prop="saleDiscountType" label="Hình thức">
          <template slot-scope="{row}">
            <el-tag>{{discountTypeLabels[row.saleDiscountType]}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="saleConditions" label="Các điều kiện">
          <template slot-scope="{row}">
            <el-tag v-for="item in row.saleConditions.split(';')" :key="item">{{saleConditionLabels[item]}}</el-tag>
          </template>
        </el-table-column>
        <template slot="action">
          <el-table-column label="Thao tác" width="250">
            <template slot-scope="{row}">
              <el-button v-if="row.saleConditions.includes(saleConditionValues.STORE_LIMIT)" size="mini" type="primary" @click="assignSale(row)">Cửa hàng</el-button>
              <el-button size="mini" type="warning" @click="editSale(row)">Sửa</el-button>
              <el-button size="mini" type="danger" @click="deleteSale(row)">Xóa</el-button>
            </template>
          </el-table-column>
        </template>
      </raw-data-table>
    </el-main>
  </el-container>
</template>

<script>
  import AdminSaleService from '@/service/admin/admin.sale.service';
  import CreateOrUpdateSaleDialog from '@/views/private/admin/sale/CreateOrUpdateSaleDialog';
  import RawDataTable from '@/components/raw-table-data/RawDataTable';
  import MessageBoxUtils from '@/utils/message-box.util';
  import AdminStoreService from '@/service/admin/admin.store.service';
  import AssignSaleDialog from '@/views/private/admin/sale/AssignSaleDialog';
  import DiscountType from '@/enum/DiscountType';
  import SaleCondition from '@/enum/SaleCondition';

  export default {
    name: 'AdminSale',
    components: {AssignSaleDialog, RawDataTable, CreateOrUpdateSaleDialog},
    data() {
      return {
        sales: [],
        discountTypeLabels: DiscountType.label,
        saleConditionLabels: SaleCondition.label,
        saleConditionValues: SaleCondition.value
      };
    },
    created() {
      this.getListSale();
    },
    methods: {
      async getListSale() {
        const {data} = await AdminSaleService.getListSale();
        this.sales = data;
      },
      createSale() {
        this.$refs.saleDialog.create();
      },
      editSale(sale) {
        this.$refs.saleDialog.edit(sale);
      },
      async deleteSale(sale){
        await MessageBoxUtils.confirmPromise("Xác nhận xóa?");
        await AdminSaleService.deleteSale(sale.guid);
        this.getListSale();
      },
      assignSale(sale){
        this.$refs.assignSaleDialog.show(sale);
      }
    },
  };
</script>

<style scoped>

</style>
