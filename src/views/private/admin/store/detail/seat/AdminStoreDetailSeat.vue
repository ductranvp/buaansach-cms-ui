<template>
  <el-container class="full-size" direction="vertical">
    <el-row class="text-center margin-bottom-10" type="flex" justify="space-around">
      <el-radio-group v-model="displayType">
        <el-radio-button label="SEAT">
          <span>{{$t("private.adminStoreDetailSeatPage.displayBySeat")}}</span>
        </el-radio-button>
        <el-radio-button label="AREA">
          <span>{{$t("private.adminStoreDetailSeatPage.displayByArea")}}</span>
        </el-radio-button>
      </el-radio-group>
      <el-row type="flex" align="middle">
        <el-col :span="12">
          <div>{{$t("private.adminStoreDetailSeatPage.density")}}</div>
        </el-col>
        <el-col :span="12">
          <el-input-number v-model="colSize" :min="3" :step="1" step-strictly :max="8"></el-input-number>
        </el-col>
      </el-row>
    </el-row>
    <el-row v-if="displayType === 'SEAT'" class="full-size flex-wrap margin-0" :gutter="10" type="flex">
      <el-col class="margin-bottom-10" :span="colSize" v-for="seat in seats" :key="seat.guid">
        <el-card shadow="never">
          <div class="text-center">
            <qrcode @click.native="goto(seat.guid)" :value="seatPrefixUrl + seat.guid" :options="{ width: colSize*40 }"></qrcode>
          </div>
          <div class="text-center text-14 text-bold-600">
            <span>{{seat.seatName}} - {{seat.areaName}}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row v-else class="full-size flex-wrap margin-0" :gutter="10" type="flex">
      <div class="full-width" v-for="area in areas" :key="area.guid">
        <el-divider>
          <span class="text-bold-700">{{area.areaName}}</span>
        </el-divider>
        <el-col class="margin-bottom-10" :span="colSize" v-for="seat in area.listSeat" :key="seat.guid">
          <el-card shadow="never">
            <div class="text-center">
              <qrcode :value="seatPrefixUrl + seat.guid" :options="{ width: colSize*40 }"></qrcode>
            </div>
            <div class="text-center text-14 text-bold-600">
              <span>{{seat.seatName}}</span>
            </div>
          </el-card>
        </el-col>
      </div>
    </el-row>
  </el-container>
</template>

<script>
  import NotificationUtils from "@/utils/notification.util";
  import AdminAreaService from "@/service/admin/admin.area.service";
  import Constants from "@/utils/constants";

  export default {
    name: "AdminStoreDetailSeat",
    data() {
      return {
        colSize: 3,
        displayType: "SEAT",
        sortType: "NAME",
        seatPrefixUrl: Constants.CLIENT_SEAT_PREFIX_URL,
        areas: [],
        seats: [],
      };
    },
    created() {
      this.getSeats();
    },
    watch: {
      $route(to, from) {
        this.getSeats();
      },
    },
    methods: {
      goto(seatGuid){
        let routeData = this.$router.resolve({name: "orderPage", params: {seatGuid: seatGuid}});
        window.open(routeData.href, '_blank');
      },
      async getSeats() {
        if (this.$route.params.storeGuid) {
          try {
            this.seats = [];
            const {data} = await AdminAreaService.getListAreaByStoreGuid(this.$route.params.storeGuid);
            this.areas = data;
            this.areas.forEach(area => {
              const seats = area.listSeat.map(seat => {
                seat.areaName = area.areaName;
                return seat;
              });
              this.seats = this.seats.concat(seats);
            });
          } catch (error) {
            NotificationUtils.error(error.message || error.data.message);
          }

        }
      }
    }
  };
</script>

<style scoped>
  /deep/ .el-card__body {
    padding: 10px;
  }
</style>
