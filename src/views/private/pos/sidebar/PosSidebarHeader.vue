<template>
  <el-header class="bg-success" height="40px">
    <el-row class="full-size" type="flex" align="middle" justify="center">
      <el-col>
        <div class="padding-0-10">
          <router-link to="/">
            <el-tooltip content="Trang chủ">
              <img alt="logo" :src="logoSquareImage" class="logo" />
            </el-tooltip>
          </router-link>
        </div>
      </el-col>
      <el-col v-if="selectedSeat.seatName" class="text-center text-light">
        <div>
          <h1>{{ selectedSeat.seatName }} - {{ selectedSeat.areaName }}</h1>
        </div>
      </el-col>
      <el-col>
        <el-row
          v-if="selectedSeat.guid"
          type="flex"
          align="middle"
          justify="end"
        >
          <el-button
            v-if="!selectedSeat.seatLocked"
            :loading="isLocking"
            @click="toggleSeatLock"
            type="success"
            size="small"
          >
            <i class="el-icon-lock"></i>
            <span>Khóa</span>
          </el-button>
          <el-button
            v-else
            :loading="isLocking"
            @click="toggleSeatLock"
            type="success"
            size="small"
          >
            <i class="el-icon-unlock"></i>
            <span>Mở khóa</span>
          </el-button>
        </el-row>
      </el-col>
    </el-row>
  </el-header>
</template>

<script>
import { mapState } from "vuex";
import MessageUtils from "@/utils/message.util";
import hotkeys from "hotkeys-js";
import ErrorUtils from "@/utils/error.util";

export default {
  name: "PosSidebarHeader",
  computed: {
    ...mapState({
      selectedSeat: state => state.posMachine.selectedSeat
    })
  },
  data() {
    return {
      isLocking: false
    };
  },
  mounted() {
    const vm = this;
    hotkeys.filter = function(event) {
      return true;
    };
    // hotkeys("f7", "posMachine", function(event, handler) {
    //   if (vm.selectedSeat.guid && !vm.isLocking) {
    //     vm.toggleSeatLock();
    //   }
    // });
    hotkeys.setScope("posMachine");
  },
  methods: {
    async toggleSeatLock() {
      const vm = this;
      try {
        vm.isLocking = true;
        await vm.$store.dispatch("posMachine/toggleSeatLock");
        setTimeout(function() {
          vm.isLocking = false;
        }, 300);
      } catch (error) {
        ErrorUtils.showActionErrorMessage(error);
      }
    }
  }
};
</script>

<style scoped>
.logo {
  height: 32px;
  width: 32px;
}
</style>
