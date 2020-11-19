<template>
  <el-dialog
          :visible.sync="dialogFormVisible"
          :close-on-click-modal="false"
          :destroy-on-close="true"
          :show-close="false"
          :fullscreen="true"
  >
    <div slot="title">
      <el-row type="flex" align="middle" class="padding-bottom-15">
        <el-col>
          <span>Chọn bàn</span>
        </el-col>
        <el-button @click="refreshAllSeat" size="small" :loading="isRefreshing">Làm mới</el-button>
        <el-button @click="hide" size="small">Đóng</el-button>
      </el-row>

    </div>
    <el-container>
      <el-main v-loading="isRefreshing">
        <el-row :gutter="10" class="full-size flex-wrap margin-0 padding-0-5">
          <template v-for="area in allAreas">
            <el-row v-show="area.showSeats" :key="area.guid">
              <el-divider class="margin-15-0">{{area.areaName}}</el-divider>
              <el-row :gutter="10" class="full-size flex-wrap margin-0">
                <template v-for="seat in area.listSeat">
                  <el-col class="margin-bottom-10"
                          v-if="displaySeatStatus === 'ALL' || seat.seatStatus === displaySeatStatus"
                          :span="6"
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
      </el-main>
    </el-container>
    <div slot="footer">
      <el-button @click="hide" size="small">
        <span>{{$t('common.entity.action.close')}}</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {mapState} from 'vuex';
  import ErrorUtils from '@/utils/error.util';

  export default {
    name: 'PosMobileSeatDialog',
    computed: {
      ...mapState({
        allAreas: state => state.posMachine.allAreas,
        selectedSeat: state => state.posMachine.selectedSeat,
        selectedArea: state => state.posMachine.selectedArea,
      }),
    },
    data() {
      return {
        isLoading: false,
        dialogFormVisible: false,
        displaySeatStatus: 'ALL',
        seatStatus: [
          {label: 'Tất cả', value: 'ALL'},
          {label: 'Còn trống', value: 'EMPTY'},
          {label: 'Đang dùng', value: 'NON_EMPTY'},
        ],
        isRefreshing: false,
      };
    },
    methods: {
      async refreshAllSeat() {
        try {
          this.isRefreshing = true;
          const currentSeatGuid = this.selectedSeat.guid;
          await this.$store.dispatch('posMachine/getAllArea', this.$route.params.storeGuid);
          await this.$store.dispatch('posMachine/changeArea', this.selectedArea.guid);
          if (currentSeatGuid){
            await this.$store.dispatch('posMachine/selectSeat', currentSeatGuid);
          }
          setTimeout(() => {
            this.isRefreshing = false;
          }, 300);
        } catch (error) {
          ErrorUtils.showActionErrorMessage(error);
        }
      },
      changeSeat(seat) {
        this.$store.dispatch('posMachine/selectSeat', seat.guid);
        setTimeout(() => {this.hide();}, 0);
      },
      show() {
        this.dialogFormVisible = true;
        this.refreshAllSeat();
      },
      hide() {
        this.dialogFormVisible = false;
      },
    },
  };
</script>

<style scoped>

</style>
