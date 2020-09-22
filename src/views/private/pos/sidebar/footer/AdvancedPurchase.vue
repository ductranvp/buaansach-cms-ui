<template>
  <el-drawer
    size="450px"
    :close-on-click-modal="false"
    :visible.sync="drawerVisible"
    :direction="direction"
    :show-close="false"
    @opened="onOpened"
    :before-close="beforeClose">
    <el-container class="full-size" direction="vertical">
      <el-header height="40px" class="bg-success">
        <el-row type="flex" align="middle" class="full-size text-light text-bold" justify="center">
          <span class="text-medium">Tùy chọn thanh toán</span>
        </el-row>
      </el-header>
      <el-main class="full-size padding-20">
<!--        <el-form onsubmit="return false">-->
<!--          <el-form-item>-->
<!--            <el-row type="flex" align="bottom">-->
<!--              <el-col :span="11">-->
<!--                <input-label label="Mã giảm giá" optional/>-->
<!--                <el-input ref="voucherCode"-->
<!--                          @keyup.native.enter="applyVoucher"-->
<!--                          v-model="voucherCode"></el-input>-->
<!--              </el-col>-->
<!--              <el-col :span="11" :offset="2">-->
<!--                <el-button-->
<!--                  @click="applyVoucher"-->
<!--                  :loading="isLoading"-->
<!--                  class="full-width"-->
<!--                  type="success"-->
<!--                  plain>-->
<!--                  <span>Áp Dụng</span>-->
<!--                </el-button>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
        <el-row style="overflow-y: auto">
          <el-card shadow="never" v-for="sale in storeSales" :key="sale.guid" class="margin-bottom-10">
            <el-row type="flex" align="middle" style="min-height: 30px;" class="padding-bottom-10">
              <el-col>
                <strong class="text-success">{{sale.saleName}}</strong>
              </el-col>
              <el-tag type="success" size="mini" v-if="sale.guid === currentOrder.saleGuid">Đã áp dụng</el-tag>
              <el-tag v-else-if="!isSaleTimeValid(sale)" type="danger" size="mini">Ngoài thời gian sử dụng</el-tag>
            </el-row>
            <el-row type="flex" align="middle">
              <el-col class="text-small" style="line-height: 22px">
                <div>
                  <span>Giảm giá: </span>
                  <span v-if="sale.saleDiscountType === discountTypes.PERCENT">{{sale.saleDiscount}}%</span>
                  <span v-else>{{sale.saleDiscount | priceAppend}}</span>
                </div>
                <div v-if="sale.timeCondition">
                  <span>Thời gian: </span>
                  <span>{{sale.timeCondition.validFrom | moment("DD/MM/YYYY")}}</span>
                  <span> - {{sale.timeCondition.validUntil | moment("DD/MM/YYYY")}}</span>
                </div>
              </el-col>
              <div>
                <el-button size="mini" type="danger" @click="cancelSale(sale)"
                           v-if="sale.guid === currentOrder.saleGuid" :loading="sale.isLoading">
                  <span>Hủy</span>
                </el-button>
                <el-button v-else-if="isSaleTimeValid(sale)" size="mini" type="success" @click="applySale(sale)" :loading="sale.isLoading">
                  <span>Áp dụng</span>
                </el-button>
              </div>
            </el-row>
          </el-card>
        </el-row>
      </el-main>
      <el-footer height="auto" id="no_border">
        <el-row type="flex" align="middle">
          <el-button @click="hide" type="warning"
                     class="no-border-radius no-border full-width text-large padding-20-10">
            <i class="el-icon-close"></i>
            <span>Đóng (Esc)</span>
          </el-button>
        </el-row>
      </el-footer>
    </el-container>
  </el-drawer>
</template>

<script>
  import {mapState} from 'vuex';
  import PosSaleService from '@/service/pos/pos.sale.service';
  import MessageUtils from '@/utils/message.util';
  import DiscountType from '@/enum/DiscountType';

  export default {
    name: 'AdvancedPurchase',
    computed: {
      ...mapState({
        currentOrder: state => state.posMachine.currentOrder,
        currentStore: state => state.posMachine.currentStore,
        selectedSeat: state => state.posMachine.selectedSeat,
      }),
    },
    data() {
      return {
        isLoading: false,
        drawerVisible: false,
        direction: 'ltr',
        voucherCode: null,
        storeSales: [],
        discountTypes: DiscountType.value,
      };
    },
    methods: {
      onOpened() {
        if (this.$refs.voucherCode)
          this.$refs.voucherCode.focus();
      },
      async applyVoucher() {
      },
      async cancelVoucher() {

      },
      async applySale(sale) {
        try {
          sale.isLoading = true;
          await PosSaleService.applySale({
            saleGuid: sale.guid,
            orderGuid: this.currentOrder.guid,
          });
          await this.$store.dispatch('posMachine/getSeatOrderInfo', this.selectedSeat.guid);
        } catch (error) {
          MessageUtils.error(error.message || error.data.message);
        } finally {
          sale.isLoading = false;
        }
      },
      async cancelSale(sale) {
        try {
          sale.isLoading = true;
          await PosSaleService.cancelSale(this.currentOrder.guid);
          await this.$store.dispatch('posMachine/getSeatOrderInfo', this.selectedSeat.guid);
        } catch (error) {
          MessageUtils.error(error.message || error.data.message);
        } finally {
          sale.isLoading = false;
        }
      },
      show() {
        this.loadData();
        this.drawerVisible = true;
      },
      hide() {
        this.drawerVisible = false;
        this.resetForm();
      },
      resetForm() {
        this.voucherCode = null;
      },
      beforeClose(done) {
        this.resetForm();
        done();
      },
      isSaleTimeValid(sale){
        if (!sale.timeCondition) return true;
        let start = (new Date(sale.timeCondition.validFrom)).getTime();
        let end = (new Date(sale.timeCondition.validUntil)).getTime();
        let now = (new Date()).getTime();
        return !(now < start || now > end);
      },
      async loadData() {
        try {
          this.storeSales = [];
          let {data} = await PosSaleService.getListStoreSale(this.currentStore.guid);
          data = data.map(item => {
            item.isLoading = false;
            return item;
          });
          console.log(data);
          this.storeSales = data;
        } catch (e) {
          MessageUtils.error('Lỗi tải danh sách khuyến mãi');
        }
      },
    },
  };
</script>

<style scoped>
  /deep/ .el-card__body {
    padding: 10px !important;
  }

  /deep/ .el-card__header {
    padding: 10px !important;
  }
</style>
