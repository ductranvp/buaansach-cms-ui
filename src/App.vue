<template>
  <div id="app" v-loading.fullscreen.lock="lostConnection">
    <router-view/>
  </div>
</template>

<script>
  import AuthUtils from "@/utils/auth.util";
  import {mapState} from "vuex";

  export default {
    name: "App",
    computed: {
      ...mapState({
        lostConnection: state => state.websocket.lostConnection
      })
    },
    mounted() {
      if (AuthUtils.getToken())
        this.$store.dispatch("websocket/connect");
      console.log(window);
    }
  };
</script>
<style lang="scss">
  html,
  body,
  #app {
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
    font-size: 100%;
  }
</style>
