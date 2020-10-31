<template>
  <el-container>
    <el-header height="auto">
      <el-row type="flex" align="middle" justify="end" class="padding-bottom-10">
        <el-button type="primary" @click="getStoreSales" :loading="isLoading">Làm mới</el-button>
      </el-row>
    </el-header>
    <el-main>
      <raw-data-table :data="storeSales" v-loading="isLoading" show-index>
        <el-table-column prop="saleImageUrl" label="Hình">
          <template slot-scope="{row}">
            <el-image style="height: 50px; width: 50px" fit="cover" :src="getMediaUrl(row.saleImageUrl)"
                      :preview-src-list="[getMediaUrl(row.saleImageUrl)]">
              <div slot="error" class="image-error-slot full-size">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="saleName" label="Tên Sale"/>
        <el-table-column prop="saleDiscount" label="Giảm giá"/>
        <el-table-column prop="saleDiscountType" label="Hình thức">
          <template slot-scope="{row}">
            <el-tag>{{discountTypeLabels[row.saleDiscountType]}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="saleConditions" label="Các điều kiện" width="150px">
          <template slot-scope="{row}">
            <el-tag v-for="item in row.saleConditions.split(';')" :key="item">{{saleConditionLabels[item]}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="timeCondition" label="Thời gian" width="150px">
          <template slot-scope="{row}">
            <div v-if="row.timeCondition">
              <div>Từ {{row.timeCondition.validFrom | moment('HH:mm DD/MM/YYYY')}}</div>
              <div>Đến {{row.timeCondition.validUntil | moment('HH:mm DD/MM/YYYY')}}</div>
            </div>
            <el-tag v-else>Không giới hạn</el-tag>
          </template>
        </el-table-column>
        <template slot="action">
          <el-table-column label="Thao tác" width="250">
            <template slot-scope="{row}">
              <el-button type="danger" size="mini" @click="makePrimarySale(row, true)"
                         v-if="adminCurrentStore.storePrimarySaleGuid === row.saleGuid">
                <span>Gỡ sale chính</span>
              </el-button>
              <el-button type="primary" size="mini" @click="makePrimarySale(row, false)" v-else>
                <span>Đặt làm sale chính</span>
              </el-button>
              <el-button size="mini" type="danger" @click="deleteStoreSale(row)">Xóa</el-button>
            </template>
          </el-table-column>
        </template>
      </raw-data-table>
    </el-main>
  </el-container>
</template>

<script>
  import ErrorUtils from '@/utils/error.util';
  import RawDataTable from '@/components/raw-table-data/RawDataTable';
  import AdminStoreSaleService from '@/service/admin/admin.store-sale.service';
  import DiscountType from '@/enum/DiscountType';
  import SaleCondition from '@/enum/SaleCondition';
  import {mapState} from 'vuex';
  import MessageBoxUtils from '@/utils/message-box.util';

  export default {
    name: 'AdminStoreDetailSale',
    components: {RawDataTable},
    computed: {
      ...mapState({
        adminCurrentStore: state => state.adminStore.adminCurrentStore,
      }),
    },
    data() {
      return {
        isLoading: false,
        storeSales: [],
        discountTypeLabels: DiscountType.label,
        saleConditionLabels: SaleCondition.label,
        saleConditionValues: SaleCondition.value,
      };
    },
    created() {
      this.getStoreSales();
    },
    methods: {
      async getStoreSales() {
        try {
          this.isLoading = true;
          const {data} = await AdminStoreSaleService.getListStoreSaleByStore(this.$route.params.storeGuid);
          this.storeSales = data.map(item => {
            item.isLoading = false;
            return item;
          });
        } catch (error) {
          ErrorUtils.showErrorMessage(error);
        } finally {
          this.isLoading = false;
        }
      },
      async makePrimarySale(storeSale, revert) {
        try {
          storeSale.isLoading = true;
          storeSale.revert = revert;
          await AdminStoreSaleService.makePrimary(storeSale);
          if (revert) {
            this.adminCurrentStore.storePrimarySaleGuid = null;
          } else {
            this.adminCurrentStore.storePrimarySaleGuid = storeSale.saleGuid;
          }
          this.$store.commit("adminStore/SET_ADMIN_CURRENT_STORE", this.adminCurrentStore);
        } catch (error) {
          ErrorUtils.showErrorMessage(error);
        } finally {
          storeSale.isLoading = false;
        }
      },
      async deleteStoreSale(storeSale) {
        await MessageBoxUtils.confirmPromise("Xoá sale này?");
        try {
          await AdminStoreSaleService.deleteStoreSale(storeSale.guid);
          this.getStoreSales();
        } catch (error) {
          ErrorUtils.showErrorMessage(error);
        }
      },
    },
  };
</script>

<style scoped>

</style>
