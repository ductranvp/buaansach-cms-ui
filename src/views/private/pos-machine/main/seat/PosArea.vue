<template>
  <el-container class="full-size" direction="vertical">
    <el-header class="padding-0-10 bg-yellowgreen" height="42px">
      <el-row class="full-size" type="flex" align="middle">
        <span class="text-bold">Khu Vực</span>
      </el-row>
    </el-header>
    <el-main class="full-size bg-light">
      <el-menu :default-active="currentAreaGuid">
        <el-menu-item index="all" @click="changeArea('all')">
          <span>Tất cả</span>
        </el-menu-item>
        <el-menu-item v-for="area in displayAreas" :key="area.guid" :index="area.guid" @click="changeArea(area.guid)">
          <span>{{area.areaName}}</span>
        </el-menu-item>
      </el-menu>
    </el-main>
  </el-container>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: "PosArea",
    computed: {
      ...mapState({
        displayAreas: state => state.posMachine.allAreas,
        currentAreaGuid: state => state.posMachine.currentAreaGuid
      })
    },
    data() {
      return {};
    },
    methods: {
      changeArea(areaGuid) {
        this.$store.dispatch("posMachine/changeSelectedSeat", areaGuid);
      }
    }
  };
</script>

<style scoped>
  .el-menu-item{
    height: 42px;
    line-height: 42px;
  }
  .el-menu-item.is-active{
    background: #cf9236;
    color: white;
    font-weight: 700;
  }
</style>
