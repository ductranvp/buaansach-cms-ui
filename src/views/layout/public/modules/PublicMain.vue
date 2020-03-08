<template>
  <el-main>
    <transition name="fade-transform" mode="out-in">
      <router-view />
    </transition>
  </el-main>
</template>

<script>
export default {
  name: "PublicMain"
};
</script>

<style scoped></style>
