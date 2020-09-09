<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    title="Kích hoạt sale cho cửa hàng"
    :close-on-click-modal="false"
    :before-close="beforeClose"
    :destroy-on-close="true"
    :fullscreen="true"
  >
    <el-main v-loading="isLoading">
      <el-row>
        <el-col :span="8">
          <el-row type="flex" justify="space-between" class="padding-bottom-10">
            <el-button @click="assignStoreSale">Áp dụng sale cho các cửa hàng đã chọn</el-button>
          </el-row>
          <raw-data-table :data="unassignedStores" selectable :select-change="onSelectChange">
            <el-table-column prop="storeCode" label="Mã cửa hàng"></el-table-column>
            <el-table-column prop="storeName" label="Tên cửa hàng"></el-table-column>
          </raw-data-table>
        </el-col>
        <el-col :span="15" :offset="1">
          <el-row type="flex" class="padding-bottom-10">
            <el-button>Đã áp dụng sale</el-button>
          </el-row>
          <raw-data-table :data="assignedStores">
            <el-table-column prop="storeCode" label="Mã cửa hàng"/>
            <el-table-column prop="storeName" label="Tên cửa hàng"/>
            <el-table-column prop="storeName" label="Sale chính">
              <template slot-scope="{row}">
                <el-tag size="medium" type="primary" v-if="row.storePrimarySaleGuid === row.saleGuid">Đã là sale chính</el-tag>
                <el-button type="primary" size="mini" @click="makePrimarySale(row)" v-else>Đặt làm sale chính</el-button>
              </template>
            </el-table-column>
            <el-table-column label="Thao tác">
              <template slot-scope="{row}">
                <el-button type="success" size="mini" v-if="row.storeSaleActivated" @click="toggleStoreSale(row)">Đã kích hoạt</el-button>
                <el-button type="danger" size="mini" v-else @click="toggleStoreSale(row)">Đã vô hiệu hóa</el-button>
                <el-button type="danger" size="mini" @click="deleteStoreSale(row)">Xóa</el-button>
              </template>
            </el-table-column>
          </raw-data-table>
        </el-col>
      </el-row>
    </el-main>
    <div slot="footer">
      <el-button @click="hide">
        <span>{{$t('common.entity.action.close')}}</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import NotificationUtils from '@/utils/notification.util';
  import RawDataTable from '@/components/raw-table-data/RawDataTable';
  import AdminStoreService from '@/service/admin/admin.store.service';
  import AdminStoreSaleService from '@/service/admin/admin.store-sale.service';
  import AppUtils from '@/utils/app.util';

  export default {
    name: 'AssignSaleDialog',
    components: {RawDataTable},
    data() {
      return {
        isEdit: false,
        isLoading: false,
        dialogFormVisible: false,
        sale: null,
        assignedStores: [],
        unassignedStores: [],
        selectedStores: [],
      };
    },
    methods: {
      async show(sale) {
        this.sale = sale;
        this.dialogFormVisible = true;
        this.loadData();
      },
      hide() {
        this.dialogFormVisible = false;
      },
      beforeClose(done) {
        done();
      },
      async loadData() {
        try {
          this.isLoading = true;
          const {data: stores} = await AdminStoreService.getAllStore();
          const {data: storeSales} = await AdminStoreSaleService.getListStoreSaleBySale(this.sale.guid);
          let storesObject = {};
          stores.forEach(store => {
            storesObject[store.guid] = store;
          });
          storeSales.forEach(item => {
            item.storeCode = storesObject[item.storeGuid].storeCode;
            item.storeName = storesObject[item.storeGuid].storeName;
            item.storePrimarySaleGuid = storesObject[item.storeGuid].storePrimarySaleGuid;
          });
          const listAssignedStoreGuid = storeSales.map(item => item.storeGuid);
          this.unassignedStores = stores.filter(item => !listAssignedStoreGuid.includes(item.guid));
          this.assignedStores = storeSales;
        } catch (error) {
          NotificationUtils.error(error.message || error.data.message);
        } finally {
          this.isLoading = false;
        }
      },
      async assignStoreSale() {
        let payload = [];
        this.selectedStores.forEach(store => {
          payload.push({
            storeSaleActivated: true,
            storeGuid: store.guid,
            saleGuid: this.sale.guid,
          });
        });
        await AdminStoreSaleService.addStoreSale(payload);
        this.loadData();
      },
      async toggleStoreSale(storeSale) {
        try {
          const payload = AppUtils.deepCopy(storeSale);
          payload.storeSaleActivated = !payload.storeSaleActivated;
          await AdminStoreSaleService.updateStoreSale(payload);
          storeSale.storeSaleActivated = !storeSale.storeSaleActivated;
        } catch (error) {
          NotificationUtils.error(error.message || error.data.message);
        }
      },
      async deleteStoreSale(storeSale) {
        await AdminStoreSaleService.deleteStoreSale(storeSale.guid);
        this.loadData();
      },
      onSelectChange(val) {
        this.selectedStores = val;
      },
      async makePrimarySale(storeSale){
        await AdminStoreSaleService.makePrimary(storeSale);
        storeSale.storePrimarySaleGuid = storeSale.saleGuid;
      }
    },
  };
</script>

<style scoped>

</style>
