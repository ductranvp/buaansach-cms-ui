<template>
  <el-header class="bg-success" height="40px">
    <el-row class="full-size" type="flex" align="middle" justify="center">
      <el-col v-if="selectedSeat.seatName" class="text-center text-light">
        <h1>{{selectedSeat.seatName}} - {{selectedSeat.areaName}}</h1>
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
  };
</script>

<style scoped>

</style>
