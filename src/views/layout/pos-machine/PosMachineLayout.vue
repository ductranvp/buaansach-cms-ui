<template>
  <el-container v-loading="!ready" class="full-size" direction="horizontal">
    <el-aside width="450px" class="aside">
      <pos-machine-sidebar/>
    </el-aside>
    <el-container class="full-size" direction="vertical">
      <pos-machine-header/>
      <pos-machine-main class="hidden-sm-and-down"/>
    </el-container>
  </el-container>
</template>

<script>
  import PosMachineSidebar from "@/views/private/pos-machine/sidebar/PosMachineSidebar";
  import PosMachineHeader from "@/views/private/pos-machine/header/PosMachineHeader";
  import PosMachineMain from "@/views/private/pos-machine/main/PosMachineMain";
  import {mapState} from "vuex";
  import WebSocketHandler from "@/views/layout/pos-machine/websocket.handler";

  export default {
    name: "PosMachineLayout",
    components: {PosMachineMain, PosMachineHeader, PosMachineSidebar},
    mixins: [WebSocketHandler],
    computed: {
      ...mapState({
        stompClient: state => state.websocket.stompClient,
        allSeats: state => state.posMachine.allSeats,
        ready: state => state.posMachine.ready,
      })
    },
    data() {
      return {askBeforeLeave: false};
    },
    watch: {
      stompClient: function (val) {
        if (this.stompClient)
          this.stompClient.subscribe("/topic/pos/" + this.$route.params.storeGuid, this.onMessageReceived);
      }
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
    created() {
      this.$store.dispatch("posMachine/initState", this.$route.params.storeGuid);
    }
  };
</script>

<style scoped>
  .pos-container,
  .pos-main-container {
    height: 100%;
  }

  .aside {
    /*box-shadow: 3px 0 5px rgba(0, 0, 0, .24);*/
    background-color: #fff;
    /*z-index: 2;*/
  }
</style>
