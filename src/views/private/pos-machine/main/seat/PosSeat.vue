<template>
  <el-container class="full-size" direction="vertical">
    <el-header class="bg-yellowgreen" height="36px">
      <el-row class="full-size" type="flex" align="middle">
        <el-col class="padding-left-5">
          <el-radio-group class="full-height" :fill="color.WARNING" v-model="displaySeatStatus" size="mini">
            <el-radio-button class="full-height no-border-radius" v-for="status in seatStatus" :key="status.value"
                             :label="status.value">
              <span>{{status.label}}</span>
            </el-radio-button>
          </el-radio-group>
        </el-col>
        <div class="text-right padding-right-5">
          <el-button class="bg-yellowgreen no-border" :loading="isRefreshing" size="mini" @click="refreshSeat">
            <span v-if="!isRefreshing"><i class="el-icon-refresh"></i><span>Làm mới</span></span>
          </el-button>
        </div>
      </el-row>
    </el-header>
    <el-main v-loading="isLoading" class="show-vertical-scroll full-size">
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
    methods: {
      async refreshSeat() {
        const vm = this;
        vm.isRefreshing = true;
        await vm.$store.dispatch("posMachine/getAllArea", vm.$route.params.storeGuid);
        await vm.$store.dispatch("posMachine/changeArea", vm.selectedArea.guid);
        setTimeout(function () {
          vm.isRefreshing = false;
        }, 1000);
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
