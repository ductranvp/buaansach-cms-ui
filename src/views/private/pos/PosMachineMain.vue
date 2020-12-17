<template>
  <el-main>
    <el-container class="full-size" direction="horizontal">
      <el-divider
        direction="vertical"
        class="full-height bg-success margin-0"
      ></el-divider>
      <el-container class="full-size" direction="vertical">
        <el-main :style="areaStyle">
          <pos-seat-layout />
        </el-main>
        <el-main :style="productStyle">
          <pos-store-product-layout />
        </el-main>
      </el-container>
      <el-divider
        direction="vertical"
        class="full-height bg-success margin-0"
      ></el-divider>
      <el-slider
        style="overflow-x: hidden"
        v-model="posSize"
        @change="changePosSize"
        vertical
        height="100%"
        :format-tooltip="formatTooltip"
      >
      </el-slider>
    </el-container>
  </el-main>
</template>

<script>
import PosSeatLayout from "@/views/private/pos/main/seat/PosSeatLayout";
import PosStoreProductLayout from "@/views/private/pos/main/store-product/PosStoreProductLayout";
import hotkeys from "hotkeys-js";
import StorageKey from "@/utils/storage-key";

export default {
  name: "PosMachineMain",
  components: { PosStoreProductLayout, PosSeatLayout },
  computed: {
    areaStyle() {
      return {
        height: 100 - this.posSize + "%"
      };
    },
    productStyle() {
      return {
        height: this.posSize + "%"
      };
    }
  },
  data() {
    return {
      posSize: localStorage.getItem(StorageKey.localStorageKeys.POS_MAIN_SIZE)
        ? JSON.parse(
            localStorage.getItem(StorageKey.localStorageKeys.POS_MAIN_SIZE)
          )
        : 45
    };
  },
  created() {
    if (this.posSize < 10) this.posSize = 10;
    if (this.posSize > 90) this.posSize = 90;
  },
  mounted() {
    const vm = this;
    hotkeys.filter = function(event) {
      return true;
    };
    hotkeys("f2", "posMachine", function(event, handler) {
      vm.posSize = vm.posSize > 50 ? 15 : 85;
    });
    hotkeys.setScope("posMachine");
  },
  beforeDestroy() {
    hotkeys.deleteScope("posMachine");
  },
  methods: {
    formatTooltip(value) {
      return "Tỉ lệ : " + (100 - value) + " | " + value + " (F2)";
    },
    changePosSize(value) {
      if (value > 90) this.posSize = 90;
      if (value < 10) this.posSize = 10;
      localStorage.setItem(
        StorageKey.localStorageKeys.POS_MAIN_SIZE,
        this.posSize
      );
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
  width: 10px;
  height: 10px;
}

/deep/ .el-slider.is-vertical .el-slider__runway {
  background-color: transparent;
  margin: 0 5px;
}
</style>
