<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    title="Thanh toán nhóm"
    :close-on-click-modal="false"
    :show-close="false"
    :before-close="beforeClose"
    :fullscreen="true"
    :destroy-on-close="true"
  >
    <el-container>
      <el-main class="padding-right-20">
        <el-container>
          <el-main>
            <el-row v-for="area in allAreas" :key="area.guid">
              <el-divider class="margin-15-0">{{area.areaName}}</el-divider>
              <el-row :gutter="10" class="full-size margin-0">
                <el-col v-for="seat in area.listSeat" class="margin-bottom-10" :span="4" :key="seat.guid">
                  <el-card :body-style="{padding: '0'}"
                           style="position: relative"
                           :style="{borderColor: area.areaColor, boxShadow: seat.checked && seat.seatLocked ? '0 0 2px 3px ' + lockColor : ''}"
                           class="pointer"
                           @click.native="toggleSeatSelection(seat)"
                           :class="[
                           seat.checked ? 'bg-selected text-white' : '',
                           seat.seatLocked ? 'bg-info text-white' : '',
                           seat.seatStatus === 'NON_EMPTY' && seat.seatServiceStatus === 'FINISHED' && !seat.seatLocked ? 'bg-success text-white' : '',
                           seat.seatStatus === 'NON_EMPTY' && seat.seatServiceStatus === 'UNFINISHED' && !seat.seatLocked ? 'bg-warning text-white' : '']">
                    <div class="text-center text-small padding-10-5">
                      <i class="el-icon-lock padding-right-5" v-if="seat.seatLocked"></i>
                      <i class="el-icon-check padding-right-5" v-else-if="seat.checked"></i>
                      <span>{{seat.seatName}}</span>
                    </div>
<!--                    <i v-if="seat.seatLocked" class="el-icon-lock" style="position: absolute; right: 0; top: 0"></i>-->
                  </el-card>
                </el-col>
              </el-row>
            </el-row>
          </el-main>
          <el-footer height="auto">
            <el-divider class="margin-10-0"></el-divider>
            <div class="text-center">
              <el-tag type="danger" class="text-large">
                <span>Chọn bàn </span>
                <i class="el-icon-arrow-right"></i>
                <span> Khóa </span>
                <i class="el-icon-arrow-right"></i>
                <span> Tính tiền</span>
              </el-tag>
            </div>
            <div class="text-center padding-10-0">
              <el-button @click="hide">
                <i class="el-icon-close"></i>
                <span>{{$t('common.entity.action.close')}}</span>
              </el-button>
              <el-button type="warning" @click="toggleLockList(false)" :disabled="!selectedSeats.length"
                         :loading="isLoading">
                <i class="el-icon-unlock"></i>
                <span>Mở</span>
              </el-button>
              <el-button type="danger" @click="toggleLockList(true)" :disabled="!selectedSeats.length"
                         :loading="isLoading">
                <i class="el-icon-lock"></i>
                <span>Khóa</span>
              </el-button>
              <el-button type="primary" @click="getListOrderByListSeat" :disabled="!selectedSeats.length || !isAllSeatLocked"
                         :loading="isLoading">
                <i class="el-icon-coin"></i>
                <span>Tính tiền</span>
              </el-button>
            </div>
          </el-footer>
        </el-container>
      </el-main>
      <el-aside width="50%">
        <el-container direction="vertical" v-if="listOrder.length">
          <el-main>
            <raw-data-table :data="listOrder" :show-pagination="false">
              <el-table-column label="Vị trí">
                <template slot-scope="{row}">
                  <span>{{row.seat.seatName}}</span>
                  <span> - </span>
                  <span>{{row.seat.areaName}}</span>
                </template>
              </el-table-column>
              <el-table-column label="SĐT">
                <template slot-scope="{row}">
                  <span>{{row.orderCustomerPhone}}</span>
                </template>
              </el-table-column>
              <el-table-column label="Tổng đơn">
                <template slot-scope="{row}">
                  <span>{{row.orderTotalAmount | priceAppend}}</span>
                </template>
              </el-table-column>
              <el-table-column label="KM">
                <template slot-scope="{row}">
                  <span>{{getDiscountAmount(row) | priceAppend}}</span>
                </template>
              </el-table-column>
              <el-table-column label="Dùng điểm">
                <template slot-scope="{row}">
                  <span>{{row.orderPointValue}}</span>
                </template>
              </el-table-column>
              <el-table-column label="Thanh toán">
                <template slot-scope="{row}">
                  <span>{{getPayAmount(row) | priceAppend}}</span>
                </template>
              </el-table-column>
            </raw-data-table>
          </el-main>
          <el-footer height="auto" class="padding-20-0">
            <el-row class="padding-bottom-10">
              <el-button class="full-width" type="primary" plain>
                <span>Tổng thanh toán:</span>
                <span>{{getTotalPayAmount() | priceAppend}}</span>
              </el-button>
            </el-row>
            <el-form onsubmit="return false">
              <el-form-item>
                <el-row type="flex">
                  <el-col :span="11">
                    <el-form-item>
                      <el-input v-model="customerPay" placeholder="Khách đưa" @keyup.enter.native="submit">
                        <template slot="append">
                          <el-button>x1000</el-button>
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11" :offset="2">
                    <el-form-item>
                      <el-button class="full-width">
                        <span>Trả lại: </span>
                        <span>{{ Math.max(customerPay * 1000 - getTotalPayAmount(), 0) | priceAppend }}</span>
                      </el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
            <div class="text-center">
              <el-button type="primary" @click="submit" :loading="isLoading">
                <span>Thanh Toán</span>
              </el-button>
            </div>
          </el-footer>
        </el-container>
      </el-aside>
    </el-container>
    <bill-group ref="billGroup" />
  </el-dialog>
</template>

<script>
  import {mapState} from 'vuex';
  import SeatServiceStatus from '@/enum/SeatServiceStatus';
  import MessageUtils from '@/utils/message.util';
  import SeatStatus from '@/enum/SeatStatus';
  import PosOrderService from '@/service/pos/pos.order.service';
  import RawDataTable from '@/components/raw-table-data/RawDataTable';
  import ErrorUtils from '@/utils/error.util';
  import PriceUtils from '@/utils/price.util';
  import BillGroup from '@/views/private/pos/bill/BillGroup';
  import PosSeatService from '@/service/pos/pos.seat.service';
  import Constants from '@/utils/constants';

  export default {
    name: 'GroupPurchaseDialog',
    components: {BillGroup, RawDataTable},
    computed: {
      ...mapState({
        allAreas: state => state.posMachine.allAreas,
        selectedArea: state => state.posMachine.selectedArea,
        selectedSeat: state => state.posMachine.selectedSeat,
        unsavedOrderProduct: state => state.posMachine.unsavedOrderProduct,
      }),
      isAllSeatLocked(){
        for (let i = 0; i < this.selectedSeats.length; i++){
          if (!this.selectedSeats[i].seatLocked) return false;
        }
        return true;
      }
    },
    data() {
      return {
        isEdit: false,
        isLoading: false,
        customerPay: null,
        dialogFormVisible: false,
        selectedSeats: [],
        listOrder: [],
        lockColor: Constants.COLOR.DANGER
      };
    },
    methods: {
      getPayAmount(order) {
        const {orderTotalAmount, orderDiscount, orderDiscountType, orderPointValue} = order;
        return PriceUtils.getPayAmount(orderTotalAmount, orderDiscount, orderDiscountType, orderPointValue);
      },
      getDiscountAmount(order) {
        const {orderTotalAmount, orderDiscount, orderDiscountType} = order;
        return PriceUtils.getDiscountAmount(orderTotalAmount, orderDiscount, orderDiscountType);
      },
      getTotalPayAmount() {
        let payAmount = 0;
        this.listOrder.forEach(item => {
          payAmount += this.getPayAmount(item);
        });
        return payAmount;
      },
      show() {
        this.clearAllSelection();
        this.dialogFormVisible = true;
      },
      hide() {
        this.clearAllSelection();
        this.dialogFormVisible = false;
      },
      beforeClose(done) {
        done();
      },
      clearAllSelection() {
        this.selectedSeats = [];
        this.listOrder = [];
        this.allAreas.forEach(area => {
          area.listSeat.forEach(seat => {
            this.$set(seat, 'checked', false);
          });
        });
      },
      toggleSeatSelection(seat) {
        if (seat.seatStatus === SeatStatus.value.EMPTY) {
          MessageUtils.error(seat.seatName + ' chưa có đơn hàng');
          return;
        }
        if (seat.seatServiceStatus === SeatServiceStatus.value.UNFINISHED) {
          MessageUtils.error(seat.seatName + ' chưa phục vụ xong');
          return;
        }
        if (!seat.checked) {
          if (this.selectedSeats.length >= 10) {
            MessageUtils.error('Chỉ chọn tối đa 10 bàn');
            return;
          }
          this.selectedSeats.push(seat);
        } else {
          const idx = this.selectedSeats.findIndex(item => item.guid === seat.guid);
          if (idx !== -1) this.selectedSeats.splice(idx, 1);
        }
        this.$store.commit('posMachine/TOGGLE_CHECK', seat);
      },
      async getListOrderByListSeat() {
        if (this.selectedSeats.length <= 1){
          MessageUtils.error("Chọn ít nhất 2 bàn để thanh toán");
          return;
        }
        try {
          this.customerPay = null;
          this.isLoading = true;
          const listSeatGuid = this.selectedSeats.map(item => item.guid);
          let {data} = await PosOrderService.getListOrderByListSeat({
            storeGuid: this.$route.params.storeGuid,
            listSeatGuid,
          });
          data = data.map(item => {
            item.seat = this.selectedSeats.find(seat => seat.guid === item.seatGuid) || {};
            return item;
          });
          let listOrder = [];
          this.selectedSeats.forEach(seat => {
            let order = data.find(item => item.seatGuid === seat.guid) || {};
            order.seat = seat;
            listOrder.push(order);
          });
          this.listOrder = listOrder;
        } catch (error) {
          ErrorUtils.showErrorMessage(error);
        } finally {
          this.isLoading = false;
        }
      },
      async submit() {
        const vm = this;
        if (this.customerPay === null || this.customerPay === "") {
          MessageUtils.error("Vui lòng nhập số tiền khách đưa");
          return;
        }
        if (this.customerPay * 1000 < this.getTotalPayAmount()){
          MessageUtils.error("Số tiền khách đưa phải lớn hơn hoặc bằng số tiền cần thanh toán");
          return;
        }
        try {
          this.isLoading = true;
          const listSeatGuid = this.selectedSeats.map(item => item.guid);
          await PosOrderService.purchaseListOrder({
            paymentNote: null,
            listSeatGuid,
          });
          this.selectedSeats.forEach(seat => {
            this.$store.commit('posMachine/CHANGE_SEAT_STATUS', {
              targetSeat: seat,
              seatStatus: SeatStatus.value.EMPTY,
              seatServiceStatus: SeatServiceStatus.value.FINISHED,
            });
            if (this.selectedSeats.find(item => item.guid === this.selectedSeat.guid)) {
              this.$store.dispatch('posMachine/clearSeat');
            }
          });
          const data = {listOrder: this.listOrder, customerPay: this.customerPay * 1000};
          this.$refs.billGroup.printBill(data, function () {
            // this function is called when print is done;
            if (vm.selectedSeats.find(item => item.guid === vm.selectedSeat.guid)) {
              vm.$store.dispatch("posMachine/printDone");
            }
            vm.$store.dispatch("posMachine/reloadAllStoreNotification");
            vm.customerPay = null;
            MessageUtils.success("Thanh toán thành công");
            vm.toggleLockList(false);
            vm.hide();
          });
        } catch (error) {
          ErrorUtils.showErrorMessage(error);
        } finally {
          this.isLoading = false;
        }
      },
      async toggleLockList(locked){
        try {
          const listSeatGuid = this.selectedSeats.map(item => item.guid);
          const payload = {
            listSeatGuid,
            locked
          };
          await PosSeatService.toggleLockList(payload);
          await this.$store.commit("posMachine/TOGGLE_LOCK_LIST", payload);
        } catch (error) {
          ErrorUtils.showErrorMessage(error);
        }
      }
    },
  };
</script>

<style lang="scss" scoped>
  .bg-selected {
    background-color: $--color-primary !important;
  }
  .outline-danger {
    box-shadow: 0 0 3px 2px green;
  }
</style>
