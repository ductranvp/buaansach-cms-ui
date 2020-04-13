<template>
  <div>
    <el-menu-item :route="{ name: item.routeName }"
                  :index="item.routeName"
                  :key="item.routeName">
      <i :class="item.meta.icon"></i><span slot="title">{{ $t(item.meta.title) }}</span>
    </el-menu-item>
  </div>
</template>

<script>
  export default {
    name: "SidebarItem",
    props: {
      item: Object,
    }
  };
</script>

<style scoped>

</style>
