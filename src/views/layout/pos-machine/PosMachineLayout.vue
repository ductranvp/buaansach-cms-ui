<template>
  <el-container v-loading="!ready" class="full-size" direction="horizontal">
    <el-aside width="450px" class="aside">
      <pos-machine-sidebar v-loading="currentStore.storeStatus ==='CLOSED'"/>
    </el-aside>
    <el-container class="full-size" direction="vertical">
      <pos-machine-header/>
      <pos-machine-main v-loading="currentStore.storeStatus ==='CLOSED'" class="hidden-sm-and-down"/>
    </el-container>
  </el-container>
</template>

<script>
  import PosMachineSidebar from "@/views/private/pos-machine/sidebar/PosMachineSidebar";
  import PosMachineHeader from "@/views/private/pos-machine/header/PosMachineHeader";
  import PosMachineMain from "@/views/private/pos-machine/main/PosMachineMain";
  import {mapState} from "vuex";
  import PosWebsocket from "@/views/layout/pos-machine/pos.websocket";

  export default {
    name: "PosMachineLayout",
    components: {PosMachineMain, PosMachineHeader, PosMachineSidebar},
    mixins: [PosWebsocket],
    computed: {
      ...mapState({
        allAreas: state => state.posMachine.allAreas,
        ready: state => state.posMachine.ready,
        currentStore: state => state.posMachine.currentStore,
        selectedSeat: state => state.posMachine.selectedSeat,
        allSeats: state => {
          let arr = [];
          state.posMachine.allAreas.forEach(area => {
            arr = arr.concat(area.listSeat);
          });
          return arr;
        }
      })
    },
    data() {
      return {askBeforeLeave: false};
    },
    mounted() {
      if (this.askBeforeLeave) {
        window.onbeforeunload = function (event) {
          event.returnValue = "ask before leave";
        };
      }
    },
    beforeDestroy() {
      window.onbeforeunload = null;
    },
    async created() {
      await this.$store.dispatch("posMachine/initState", this.$route.params.storeGuid);
    }
  };
</script>

<style scoped>
  .pos-container,
  .pos-main-container {
    height: 100%;
  }

  .aside {
    background-color: #fff;
  }
</style>
