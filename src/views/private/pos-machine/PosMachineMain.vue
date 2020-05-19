<template>
  <el-main>
    <el-container class="full-size" direction="horizontal">
      <el-divider direction="vertical" class="full-height bg-success margin-0"></el-divider>
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
          <pos-seat-layout/>
        </el-main>
        <el-main :style="productStyle">
          <pos-store-product-layout/>
        </el-main>
      </el-container>
    </el-container>
  </el-main>
</template>

<script>
  import PosSeatLayout from "@/views/private/pos-machine/main/seat/PosSeatLayout";
  import PosStoreProductLayout from "@/views/private/pos-machine/main/store-product/PosStoreProductLayout";
  import hotkeys from 'hotkeys-js';

  export default {
    name: "PosMachineMain",
    components: {PosStoreProductLayout, PosSeatLayout},
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
        posSize: localStorage.getItem("posMainSize") ? JSON.parse(localStorage.getItem("posMainSize")) : 50
      };
    },
    created() {
      if (this.posSize < 10) this.posSize = 10;
      if (this.posSize > 90) this.posSize = 90;
    },
    mounted() {
      const vm = this;
      hotkeys.filter = function (event) {
        return true;
      };
      hotkeys('alt+a', 'posMachine', function (event, handler) {
        vm.posSize = 10;
        localStorage.setItem("posMainSize", 10 + "");
      });
      hotkeys('alt+s', 'posMachine', function (event, handler) {
        vm.posSize = 90;
        localStorage.setItem("posMainSize", 90 + "");
      });
      hotkeys.setScope("posMachine");
    },
    beforeDestroy() {
      hotkeys.deleteScope('posMachine');
    },
    methods: {
      formatTooltip(value) {
        return "Tỉ lệ : " + (100 - value) + " | " + (value);
      },
      changePosSize(value) {
        if (value > 90) this.posSize = 90;
        if (value < 10) this.posSize = 10;
        localStorage.setItem("posMainSize", this.posSize);
      }
    }
  };
</script>

<style lang="scss" scoped>
  /deep/ .el-slider__bar {
    background: transparent;
  }

  /deep/ .el-slider__button {
    border: solid 2px $--color-success;
    background: $--color-success;
    width: 8px;
    height: 8px;
  }

  /deep/ .el-slider.is-vertical .el-slider__runway {
    background-color: transparent;
    margin: 0 4px;
  }
</style>
