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
          <div>Canh lề:</div>
        </el-col>
        <el-col :span="12">
          <el-input-number v-model="marginSize" :min="0" :step="1" step-strictly :max="4"></el-input-number>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle">
        <el-col :span="12">
          <div>{{$t("private.adminStoreDetailSeatPage.density")}}</div>
        </el-col>
        <el-col :span="12">
          <el-input-number v-model="colSize" :min="3" :step="1" step-strictly :max="8"></el-input-number>
        </el-col>
      </el-row>
    </el-row>
    <el-row type="flex" align="middle" justify="center" class="padding-bottom-10">
      <el-button @click="downloadAll" :loading="isDownloading">
        <i class="el-icon-download"></i>
        <span>Tải xuống tất cả</span>
      </el-button>
    </el-row>
    <el-row v-if="displayType === 'SEAT'" class="full-size flex-wrap margin-0" :gutter="10" type="flex">
      <el-col class="margin-bottom-10" :span="colSize" v-for="seat in seats" :key="seat.guid">
        <el-card shadow="never">
          <div class="text-center">
            <qrcode :ref="seat.guid" class="pointer" @click.native="goto(seat.guid)" :value="seatPrefixUrl + seat.guid"
                    :options="{ width: colSize*40, margin: marginSize }" tag="img"></qrcode>
          </div>
          <div class="text-center">
            <span class="text-normal">{{seat.seatName}} - {{seat.areaName}}</span>
            <div class="padding-top-5">
              <el-button @click="downloadImage(seat)" size="mini" class="full-width">Tải xuống</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row v-else class="full-size flex-wrap margin-0" :gutter="10" type="flex">
      <div class="full-width" v-for="area in areas" :key="area.guid">
        <el-divider>
          <span>{{area.areaName}}</span>
        </el-divider>
        <el-col class="margin-bottom-10" :span="colSize" v-for="seat in area.listSeat" :key="seat.guid">
          <el-card shadow="never">
            <div class="text-center">
              <qrcode :value="seatPrefixUrl + seat.guid" :options="{ width: colSize*40 }"></qrcode>
            </div>
            <div class="text-center">
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
        isDownloading: false,
        colSize: 4,
        marginSize: 1,
        displayType: "SEAT",
        sortType: "NAME",
        seatPrefixUrl: Constants.CUSTOMER_UI_SEAT_PREFIX_URL,
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
      downloadImage(seat) {
        console.log(seat.seatName + " - " + seat.areaName);
        let link = document.createElement("a"); //Create <a>
        link.href = this.$refs[seat.guid][0].$el.currentSrc; //Image Base64 Goes here
        link.download = seat.seatName + " - " + seat.areaName + ".png"; //File name Here
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      downloadAll(){
        const vm = this;
        vm.isDownloading = true;
        let i = 0;
        function download(i){
          if (i < vm.seats.length){
            setTimeout(()=> {
              vm.downloadImage(vm.seats[i]);
              i++;
              download(i);
            }, 100);
          } else {
            vm.isDownloading = false;
          }
        }
        download(0);
      },
      goto(seatGuid) {
        let routeData = this.seatPrefixUrl + seatGuid;
        window.open(routeData, '_blank');
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
