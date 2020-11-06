<template>
  <el-container class="full-size" direction="vertical" v-loading="isLoading || isRefreshing">
    <el-header class="bg-yellowgreen" height="40px">
      <el-row class="full-size padding-0-10" type="flex" align="middle">
        <el-col class="hidden-sm-and-down">
          <el-row type="flex" align="middle">
            <el-button type="success" plain size="mini" @click="groupPurchase">
              <span><i class="el-icon-money"></i><span>Thanh toán nhóm</span></span>
            </el-button>
            <el-radio-group class="full-height hidden-md-and-down padding-left-10" :fill="color.SUCCESS" v-model="displaySeatStatus"
                            size="mini">
              <el-radio-button class="full-height no-border-radius" v-for="status in seatStatus" :key="status.value"
                               :label="status.value">
                <span>{{status.label}}</span>
              </el-radio-button>
            </el-radio-group>

            <el-popover
              ref="guidePopover"
              placement="bottom"
              width="250"
              trigger="hover">
              <div>
                <el-row class="padding-bottom-5" type="flex" align="middle">
                  <el-button size="medium"></el-button>
                  <span class="padding-left-10">Còn trống</span>
                </el-row>
                <el-row class="padding-bottom-5" type="flex" align="middle">
                  <el-button size="medium" type="success"></el-button>
                  <span class="padding-left-10">Đang dùng, đã phục vụ xong</span>
                </el-row>
                <el-row class="padding-bottom-5" type="flex" align="middle">
                  <el-button size="medium" type="warning"></el-button>
                  <span class="padding-left-10">Đang dùng, chưa phục vụ xong</span>
                </el-row>
                <el-row type="flex" align="middle">
                  <el-button size="medium" type="info"></el-button>
                  <span class="padding-left-10">Đã khóa</span>
                </el-row>
              </div>
            </el-popover>

            <el-button v-popover:guidePopover class="bg-yellowgreen no-border padding-0 margin-left-10" size="mini" circle>
              <span class="text-very-large text-white">
                <i class="el-icon-question"></i>
              </span>
<!--              <span>Chú thích</span>-->
            </el-button>

          </el-row>
        </el-col>
        <div class="text-right">
          <el-tooltip content="Phím tắt: F4">
            <el-button type="success" plain :loading="isRefreshing" size="mini" @click="refreshSeat">
              <span><i class="el-icon-refresh" v-if="!isRefreshing"></i><span>Làm mới</span></span>
            </el-button>
          </el-tooltip>
        </div>
      </el-row>
    </el-header>
    <el-main class="show-vertical-scroll full-size">
      <el-row :gutter="10" class="full-size flex-wrap margin-0 padding-0-5">
        <template v-for="area in allAreas">
          <el-row v-show="area.showSeats" :key="area.guid">
            <el-divider class="margin-15-0">{{area.areaName}}</el-divider>
            <el-row :gutter="10" class="full-size flex-wrap margin-0">
              <template v-for="seat in area.listSeat">
                <el-col class="margin-bottom-10"
                        v-if="displaySeatStatus === 'ALL' || seat.seatStatus === displaySeatStatus"
                        :span="4"
                        :key="seat.guid">
                  <el-card :body-style="{padding: '0'}"
                           :style="{borderColor: area.areaColor, boxShadow: selectedSeat.guid === seat.guid ? '0 0 2px 4px ' + area.areaColor : ''}"
                           :class="[
                           seat.seatLocked ? 'bg-info text-white' : '',
                           seat.seatStatus === 'NON_EMPTY' && seat.seatServiceStatus === 'FINISHED' && !seat.seatLocked ? 'bg-success text-white' : '',
                           seat.seatStatus === 'NON_EMPTY' && seat.seatServiceStatus === 'UNFINISHED' && !seat.seatLocked ? 'bg-warning text-white' : '']"
                           class="pointer" shadow="never" @click.native="changeSeat(seat)">
                    <div class="text-center text-small padding-10-5">
                      <i class="el-icon-lock padding-right-5" v-if="seat.seatLocked"></i>
                      <span>{{seat.seatName}}</span>
                    </div>
                  </el-card>
                </el-col>
              </template>
            </el-row>
          </el-row>
        </template>
      </el-row>
      <group-purchase-dialog ref="groupPurchaseDialog" />
    </el-main>
  </el-container>
</template>

<script>
  import {mapState} from 'vuex';
  import Constants from '@/utils/constants';
  import MessageUtils from '@/utils/message.util';
  import hotkeys from 'hotkeys-js';
  import GroupPurchaseDialog from '@/views/private/pos/main/seat/dialog/GroupPurchaseDialog';
  import ErrorUtils from '@/utils/error.util';

  export default {
    name: 'PosSeat',
    components: {GroupPurchaseDialog},
    computed: {
      ...mapState({
        allAreas: state => state.posMachine.allAreas,
        selectedArea: state => state.posMachine.selectedArea,
        selectedSeat: state => state.posMachine.selectedSeat,
        unsavedOrderProduct: state => state.posMachine.unsavedOrderProduct,
      }),
    },
    data() {
      return {
        isRefreshing: false,
        color: Constants.COLOR,
        isLoading: false,
        displaySeatStatus: 'ALL',
        seatStatus: [
          {label: 'Tất cả', value: 'ALL'},
          {label: 'Còn trống', value: 'EMPTY'},
          {label: 'Đang dùng', value: 'NON_EMPTY'},
        ],
      };
    },
    mounted() {
      const vm = this;
      hotkeys.filter = function(event) {
        return true;
      };
      hotkeys('f4', 'posMachine', function(event, handler) {
        if (!vm.isRefreshing) {
          vm.refreshSeat();
        }
      });
      hotkeys.setScope('posMachine');
    },
    methods: {
      groupPurchase(){
        this.$refs.groupPurchaseDialog.show();
      },
      async refreshSeat() {
        const vm = this;
        try {
          vm.isRefreshing = true;
          await vm.$store.dispatch('posMachine/getAllArea', vm.$route.params.storeGuid);
          await vm.$store.dispatch('posMachine/changeArea', vm.selectedArea.guid);
          setTimeout(function() {
            vm.isRefreshing = false;
          }, 300);
        } catch (error) {
          ErrorUtils.showActionErrorMessage(error);
        }
      },
      changeSeat(seat) {
        if (this.selectedSeat.guid !== seat.guid)
          this.$store.dispatch('posMachine/selectSeat', seat.guid);
      },
    },
  };
</script>

<style scoped>
  .selected-seat {
    /*box-shadow: 0 0 5px green;*/
    box-shadow: 0 0 3px 2px green;
  }
</style>
