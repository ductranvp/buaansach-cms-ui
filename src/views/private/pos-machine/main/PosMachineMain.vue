<template>
  <el-main>
    <el-container class="full-size" direction="horizontal">
      <el-slider
        v-model="posSize"
        @change="changePosSize"
        vertical
        :format-tooltip="formatTooltip"
        height="100%">
      </el-slider>
      <el-divider direction="vertical" class="full-height bg-success margin-0"></el-divider>
      <el-container class="full-size" direction="vertical">
        <el-main :style="areaStyle">
          <pos-main-area/>
        </el-main>
        <el-divider class="full-width bg-success margin-0"></el-divider>
        <el-main :style="productStyle">
          <pos-main-product/>
        </el-main>
      </el-container>
    </el-container>
  </el-main>
</template>

<script>
  import PosMainArea from "@/views/private/pos-machine/main/area/PosMainArea";
  import PosMainProduct from "@/views/private/pos-machine/main/product/PosMainProduct";

  export default {
    name: "PosMachineMain",
    components: {PosMainProduct, PosMainArea},
    computed: {
      areaStyle() {
        return {
          height: 100 - this.posSize + '%',
        };
      },
      productStyle() {
        return {
          height: this.posSize + '%',
        };
      }
    },
    data() {
      return {
        posSize: localStorage.getItem("posSize") ? JSON.parse(localStorage.getItem("posSize")) : 50
      };
    },
    methods: {
      formatTooltip(value) {
        return "Tỉ lệ : " + (100 - value) + " | " + (value);
      },
      changePosSize(value) {
        if (value > 85) this.posSize = 85;
        if (value < 15) this.posSize = 15;
        localStorage.setItem("posSize", value);
      }
    }
  };
</script>

<style scoped>
  /deep/ .el-slider__bar {
    background: transparent;
  }

  /deep/ .el-slider__button {
    border: solid 2px #159550;
    background: #159550;
    width: 8px;
    height: 8px;
  }

  /deep/ .el-slider.is-vertical .el-slider__runway {
    background-color: transparent;
    margin: 0 4px;
  }
</style>
