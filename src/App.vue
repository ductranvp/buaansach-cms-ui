<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

  export default {
    name: "App",
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
  body {
    overflow-y: hidden;
  }
</style>
