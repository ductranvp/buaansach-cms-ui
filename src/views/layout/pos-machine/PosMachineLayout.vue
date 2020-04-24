<template>
  <el-container v-loading="!$store.getters.posMachine.ready" class="pos-container" direction="horizontal">
    <el-aside width="400px">
      <pos-machine-sidebar class="pos-sidebar"/>
    </el-aside>
    <el-container class="pos-main-container" direction="vertical">
      <pos-machine-header class="pos-header"/>
      <pos-machine-main class="pos-main"/>
    </el-container>
  </el-container>
</template>

<script>
  import PosMachineSidebar from "@/views/private/pos-machine/sidebar/PosMachineSidebar";
  import PosMachineHeader from "@/views/private/pos-machine/header/PosMachineHeader";
  import PosMachineMain from "@/views/private/pos-machine/main/PosMachineMain";
  import MessageBoxUtils from "@/utils/message-box.util";

  export default {
    name: "PosMachineLayout",
    components: {PosMachineMain, PosMachineHeader, PosMachineSidebar},
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
    beforeRouteLeave(to, from, next) {
      if (to.name === "loginPage") next();
      else {
        MessageBoxUtils.confirm("Bạn có chắc muốn rời trang này?", function () {
          next();
        });
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

  .pos-sidebar {
    background: #aaa;
  }

  .pos-header {
    background: #eee;
  }

  .pos-main {
    background: #f0f2f5 !important;
  }
</style>
