<template>
  <el-container class="full-size" direction="vertical">
    <el-header class="bg-yellowgreen" height="36px">
      <el-row class="full-size" type="flex" align="middle">
        <el-col class="padding-left-5 hidden-sm-and-down">
          <el-row type="flex" align="middle">
            <el-radio-group class="full-height" :fill="color.WARNING" v-model="displaySeatStatus" size="mini">
              <el-radio-button class="full-height no-border-radius" v-for="status in seatStatus" :key="status.value"
                               :label="status.value">
                <span>{{status.label}}</span>
              </el-radio-button>
            </el-radio-group>

            <el-popover
              ref="guidePopover"
              placement="bottom"
              width="250"
              trigger="click">
              <div>
                <el-row class="padding-bottom-5" type="flex" align="middle">
                  <el-button size="medium"></el-button>
                  <span class="padding-left-10">Còn trống</span>
                </el-row>
                <el-row class="padding-bottom-5" type="flex" align="middle">
                  <el-button size="medium" type="warning"></el-button>
                  <span class="padding-left-10">Đang dùng, đã phục vụ xong</span>
                </el-row>
                <el-row class="padding-bottom-5" type="flex" align="middle">
                  <el-button size="medium" type="danger"></el-button>
                  <span class="padding-left-10">Đang dùng, chưa phục vụ xong</span>
                </el-row>
                <el-row type="flex" align="middle">
                  <el-button size="medium" type="info"></el-button>
                  <span class="padding-left-10">Đã khóa</span>

                </el-row>
              </div>
            </el-popover>

            <el-button v-popover:guidePopover class="bg-yellowgreen no-border" size="mini">
              <span><i class="el-icon-help"></i><span>Hướng dẫn</span></span>
            </el-button>
          </el-row>
        </el-col>
        <div class="text-right padding-right-5">
          <el-button class="bg-yellowgreen no-border" :loading="isRefreshing" size="mini" @click="refreshSeat">
            <span><i class="el-icon-refresh"  v-if="!isRefreshing"></i><span>Làm mới (F9)</span></span>
          </el-button>
        </div>
      </el-row>
    </el-header>
    <el-main v-loading="isLoading || isRefreshing" class="show-vertical-scroll full-size">
      <el-row :gutter="10" class="full-size flex-wrap margin-0 padding-0-5">
        <template v-for="area in allAreas">
          <el-row v-show="area.display" :key="area.guid">
            <el-divider class="margin-15-0">{{area.areaName}}</el-divider>
            <el-row :gutter="10" class="full-size flex-wrap margin-0">
              <template v-for="seat in area.listSeat">
                <el-col class="margin-bottom-10"
                        v-if="displaySeatStatus === 'ALL' || seat.seatStatus === displaySeatStatus"
                        :span="3"
                        :key="seat.guid">
                  <el-card :body-style="{padding: '0'}"
                           :style="{borderColor: area.areaColor, boxShadow: selectedSeat.guid === seat.guid ? '0 0 1px 2px ' + area.areaColor : ''}"
                           :class="[
                           seat.seatLocked ? 'bg-info' : '',
                           seat.seatStatus === 'NON_EMPTY' && seat.seatServiceStatus === 'FINISHED' && !seat.seatLocked ? 'bg-warning' : '',
                           seat.seatStatus === 'NON_EMPTY' && seat.seatServiceStatus === 'UNFINISHED' && !seat.seatLocked ? 'bg-danger' : '']"
                           class="pointer" shadow="never" @click.native="changeSeat(seat)">
                    <div class="text-center text-small padding-10-5">
                      <span>{{seat.seatName}}</span>
                    </div>
                  </el-card>
                </el-col>
              </template>
            </el-row>
          </el-row>
        </template>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
  import {mapState} from "vuex";
  import Constants from "@/utils/constants";
  import MessageUtils from "@/utils/message.util";
  import hotkeys from "hotkeys-js";

  export default {
    name: "PosSeat",
    computed: {
      ...mapState({
        displaySeats: state => state.posMachine.displaySeats,
        allAreas: state => state.posMachine.allAreas,
        selectedArea: state => state.posMachine.selectedArea,
        selectedSeat: state => state.posMachine.selectedSeat,
        unsavedOrderProduct: state => state.posMachine.unsavedOrderProduct,
      })
    },
    data() {
      return {
        isRefreshing: false,
        color: Constants.COLOR,
        defaultAreaGuid: Constants.DEFAULT_AREA_GUID,
        isLoading: false,
        displaySeatStatus: "ALL",
        seatStatus: [
          {label: "Tất cả", value: "ALL"},
          {label: "Còn trống", value: "EMPTY"},
          {label: "Đang dùng", value: "NON_EMPTY"},
        ]
      };
    },
    mounted() {
      const vm = this;
      hotkeys.filter = function (event) {
        return true;
      };
      hotkeys('f9', 'posMachine', function (event, handler) {
        if (!vm.isRefreshing) {
          vm.refreshSeat();
        }
      });
      hotkeys.setScope("posMachine");
    },
    methods: {
      async refreshSeat() {
        const vm = this;
        try {
          vm.isRefreshing = true;
          await vm.$store.dispatch("posMachine/getAllArea", vm.$route.params.storeGuid);
          await vm.$store.dispatch("posMachine/changeArea", vm.selectedArea.guid);
          setTimeout(function () {
            vm.isRefreshing = false;
          }, 300);
        } catch (e) {
          MessageUtils.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
        }
      },
      changeSeat(seat) {
        if (this.selectedSeat.guid !== seat.guid)
          this.$store.dispatch("posMachine/selectSeat", seat);
      }
    }
  };
</script>

<style scoped>
  .selected-seat {
    /*box-shadow: 0 0 5px green;*/
    box-shadow: 0 0 3px 2px green;
  }
</style>
