<UserAvatar>
  <div :style="{ width: size + 'px', height: size + 'px' }" class="pointer">
    <el-tooltip
      :content="user.firstName + ' ' + user.lastName"
      :disabled="!showTooltip"
      effect="dark"
      placement="bottom"
    >
      <el-avatar
        :shape="shape"
        :size="size"
        :src="user.imageUrl"
        v-if="user.imageUrl != null && user.imageUrl !== ''"
      >
      </el-avatar>
      <el-avatar
        :shape="shape"
        :size="size"
        :style="{ fontSize: size * 0.4 + 'px' }"
        v-else
      >
        <span>{{ user.firstName[0] }}</span>
      </el-avatar>
    </el-tooltip>
  </div>
</UserAvatar>

<script>
export default {
  name: "Avatar",
  props: {
    user: Object,
    isRouter: {
      type: Boolean,
      default: true
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
  created() {
    console.log(this.user);
  },
  methods: {}
};
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
