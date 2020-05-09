<template>
  <el-header class="bg-success" height="40px">
    <el-row class="full-size" type="flex" align="middle" justify="center">
      <el-col>
        <!--        <el-button type="success" size="small">-->
        <!--          <i class="el-icon-lock"></i>-->
        <!--          <span>Khóa bàn</span>-->
        <!--        </el-button>-->
      </el-col>
      <el-col v-if="selectedSeat.seatName" class="text-center text-light">
        <h1>{{selectedSeat.seatName}} - {{selectedSeat.areaName}}</h1>
      </el-col>
      <el-col class="text-right">
        <el-button v-if="selectedSeat.currentOrderGuid" :loading="isRefreshing" @click="refreshSeatOrder" type="success"
                   size="small">
          <i class="el-icon-refresh"></i>
          <span>Làm mới</span>
        </el-button>
      </el-col>
    </el-row>
  </el-header>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: "PosSidebarHeader",
    computed: {
      ...mapState({
        selectedSeat: state => state.posMachine.selectedSeat,
      })
    },
    data() {
      return {isRefreshing: false};
    },
    methods: {
      async refreshSeatOrder() {
        const vm = this;
        vm.isRefreshing = true;
        await vm.$store.dispatch("posMachine/getSeatOrderInfo", vm.selectedSeat.guid);
        setTimeout(function () {
          vm.isRefreshing = false;
        }, 1000);
      }
    }
  };
</script>

<style scoped>

</style>
