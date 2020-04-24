<template>
  <el-container class="full-size" direction="vertical">
    <el-header class="padding-0-10 bg-yellowgreen" height="42px">
      <el-row :gutter="10" class="full-size" type="flex" align="middle">
        <el-col :span="8">
          <el-autocomplete
            ref="filterSeat"
            class="full-width"
            size="small"
            v-model="filterSeat"
            :fetch-suggestions="querySeat"
            placeholder="Nhập tên chỗ khoặc khu vực (F3)"
            :debounce="filterDebounce"
            :trigger-on-focus="false"
          ></el-autocomplete>
        </el-col>
        <el-col :span="10" class="text-center">
          <span class="text-bold">{{selectedArea.areaName}}</span>
        </el-col>
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
        <el-col
          v-for="seat in filterSeat ? filteredSeat : displaySeats"
          class="margin-bottom-10"
          :span="sizes[displaySeatSize]"
          :key="seat.guid"
        >
          <el-card :class="[selectedSeat.guid === seat.guid? 'selected-seat' : '',
            seat.seatStatus === 'NON_EMPTY'? 'bg-warning' : '']"
                   class="pointer" shadow="never" @click.native="changeSeat(seat)">
            <div class="text-center">
              <div>{{seat.seatName}}</div>
              <el-divider class="full-width margin-10-0"></el-divider>
              <div>{{seat.areaName}}</div>
            </div>
          </el-card>
        </el-col>
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
        selectedSeat: state => state.posMachine.selectedSeat
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
        filterDebounce: 400,
        filterSeat: "",
        filteredSeat: [],
        displaySeatSize: localStorage.getItem("displaySeatSize")
          ? JSON.parse(localStorage.getItem("displaySeatSize"))
          : 2,
        sizes: {
          1: 3,
          2: 4,
          3: 6,
          4: 8
        }
      };
    },
    watch: {
      selectedArea: function () {
        this.filterSeat = "";
      },
      filterSeat: function (val) {
        this.isLoading = val;
      }
    },
    methods: {
      changeSeat(seat) {
        if (this.selectedSeat.guid !== seat.guid)
          this.$store.dispatch("posMachine/selectSeat", seat);
      },
      changeDisplaySeatSize(value) {
        localStorage.setItem("displaySeatSize", value);
      },
      querySeat(keyword, cb) {
        keyword = keyword.trim();
        this.filteredSeat = this.displaySeats.filter(
          seat =>
            seat.seatName.toLowerCase().search(keyword) !== -1 ||
            seat.areaName.toLowerCase().search(keyword) !== -1
        );
        this.isLoading = false;
        cb([]);
      }
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
