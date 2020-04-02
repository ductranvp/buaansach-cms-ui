<template>
  <el-main>
    <transition name="fade-transform" mode="out-in">
      <router-view />
    </transition>
  </el-main>
</template>

<script>
export default {
  name: "AdminMain",
  computed: {
    key() {
      return this.$route.path;
    }
  }
};
</script>

<style scoped></style>
