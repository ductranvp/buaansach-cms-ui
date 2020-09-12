<template>
  <div :style="{ width: size + 'px', height: size + 'px' }" class="pointer">
    <el-tooltip
      :content="user.fullName"
      :disabled="!showTooltip"
      effect="dark"
      placement="bottom"
    >
      <el-avatar
        :shape="shape"
        :size="size"
        :src="getMediaUrl(user.avatarUrl) || circleUrl"
      >
      </el-avatar>
    </el-tooltip>
  </div>
</template>

<script>
  export default {
    name: "Avatar",
    props: {
      user: Object,
      isRouter: {
        type: Boolean,
        default: false
      },
      showTooltip: {
        type: Boolean,
        default: true
      },
      size: {
        type: Number,
        default: 100
      },
      shape: {
        type: String,
        default: "circle"
      }
    },
    data() {
      return {
        circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      };
    },
    created() {
    },
    methods: {}
  };
</script>

<style scoped>
  .pointer {
    cursor: pointer;
  }
</style>
