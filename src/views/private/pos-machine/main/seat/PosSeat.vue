<template>
  <el-container class="full-size" direction="vertical">
    <el-header class="padding-0-10 bg-yellowgreen" height="42px">
      <el-row :gutter="10" class="full-size" type="flex" align="middle">
        <el-col :span="10">
          <el-radio-group fill="#159550" v-model="displaySeatType" size="mini">
            <el-radio-button label="ALL">Tất cả</el-radio-button>
            <el-radio-button label="EMPTY">Còn trống</el-radio-button>
            <el-radio-button label="NON_EMPTY">Đang dùng</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="8"></el-col>
        <el-col :span="6">
          <el-row :gutter="10" type="flex" align="middle">
            <div class="text-bold padding-right-10" style="white-space: nowrap;">Mật độ</div>
            <el-col>
              <el-slider
                v-model="displaySeatSize"
                @change="changeDisplaySeatSize"
                :show-tooltip="false"
                show-stops
                :step="1"
                :min="1"
                :max="4"
              ></el-slider>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-header>
    <el-main v-loading="isLoading" class="show-vertical-scroll full-size padding-left-5 padding-right-5 padding-top-10">
      <el-row :gutter="10" class="full-size flex-wrap margin-0">
        <template v-for="seat in displaySeats">
          <el-col v-if="displaySeatType === 'ALL' ? true : seat.seatStatus === displaySeatType" class="margin-bottom-10"
                  :span="sizes[displaySeatSize]" :key="seat.guid">
            <el-card :body-style="{padding: '10px'}"
                     :class="[
                       selectedSeat.guid === seat.guid? 'selected-seat' : '',
                       seat.seatStatus === 'NON_EMPTY'? 'bg-warning' : '',
                       ]"
                     class="pointer" shadow="never" @click.native="changeSeat(seat)">
              <div class="text-center" :class="textSize[displaySeatSize]">
                <div>{{seat.seatName}}</div>
                <template v-if="!selectedArea.guid">
                  <el-divider class="full-width margin-10-0"></el-divider>
                  <div>{{seat.areaName}}</div>
                </template>
              </div>
            </el-card>
          </el-col>
        </template>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
  import {mapState} from "vuex";
  import hotkeys from "hotkeys-js";

  export default {
    name: "PosSeat",
    computed: {
      ...mapState({
        displaySeats: state => state.posMachine.displaySeats,
        selectedArea: state => state.posMachine.selectedArea,
        selectedSeat: state => state.posMachine.selectedSeat,
        unsavedOrderProduct: state => state.posMachine.unsavedOrderProduct,
      })
    },
    mounted() {
      const vm = this;
      hotkeys("f8", "posMachine", function (event, handler) {
        vm.$refs.filterSeat.focus();
      });
    },
    data() {
      return {
        isLoading: false,
        textSize: {
          1: 'text-small',
          2: 'text-medium',
          3: 'text-large',
          4: 'text-large',
        },
        displaySeatSize: localStorage.getItem("displaySeatSize")
          ? JSON.parse(localStorage.getItem("displaySeatSize"))
          : 2,
        sizes: {
          1: 3,
          2: 4,
          3: 6,
          4: 8
        },
        displaySeatType: localStorage.getItem("displaySeatType")
          ? JSON.parse(localStorage.getItem("displaySeatType"))
          : 'ALL',
        types: {
          ALL: 'ALL',
          EMPTY: 'EMPTY',
          NON_EMPTY: 'NON_EMPTY',
        }
      };
    },
    watch: {},
    methods: {
      changeSeat(seat) {
        if (this.selectedSeat.guid !== seat.guid)
          this.$store.dispatch("posMachine/selectSeat", seat);
      },
      changeDisplaySeatSize(value) {
        localStorage.setItem("displaySeatSize", value);
      },
    }
  };
</script>

<style scoped>
  .selected-seat {
    /*box-shadow: 0 0 5px green;*/
    box-shadow: 0 0 3px 2px green;
  }

  .non-empty-seat {
    background-color: darkgoldenrod;
  }
</style>
