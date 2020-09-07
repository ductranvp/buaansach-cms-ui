<template>
  <el-container class="full-size" direction="vertical">
    <el-header class="padding-0-10 bg-yellowgreen" height="36px">
      <el-row class="full-size" type="flex" align="middle">
        <span class="text-bold">Khu Vực</span>
      </el-row>
    </el-header>
    <el-main class="full-size">
      <el-menu class="full-height" :default-active="selectedArea.guid">
        <el-menu-item class="padding-0" :index="defaultArea.guid" @click="changeArea(defaultArea.guid)">
          <el-row type="flex" class="full-size">
            <div :style="{backgroundColor: defaultArea.areaColor, width: '5px'}"></div>
            <el-col>
              <div class="padding-0-10">Tất cả</div>
            </el-col>
          </el-row>
        </el-menu-item>
        <el-menu-item class="padding-0" v-for="area in displayAreas" :key="area.guid" :index="area.guid"
                      @click="changeArea(area.guid)">
          <el-row type="flex" class="full-size">
            <div :style="{backgroundColor: area.areaColor, width: '5px'}"></div>
            <el-col>
              <div class="padding-0-10">{{area.areaName}}</div>
            </el-col>
          </el-row>
        </el-menu-item>
      </el-menu>
    </el-main>
  </el-container>
</template>

<script>
  import {mapState} from "vuex";
  import DefaultEntity from '@/utils/default-entity';

  export default {
    name: "PosArea",
    computed: {
      ...mapState({
        displayAreas: state => state.posMachine.allAreas,
        selectedArea: state => state.posMachine.selectedArea,
      })
    },
    data() {
      return {
        defaultArea: DefaultEntity.area
      };
    },
    methods: {
      changeArea(areaGuid) {
        this.$store.dispatch("posMachine/changeArea", areaGuid);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .el-menu-item {
    height: 42px;
    line-height: 42px;
  }

  .el-menu-item.is-active {
    background: $--color-warning;
    color: white;
    font-weight: 700;
  }
</style>
