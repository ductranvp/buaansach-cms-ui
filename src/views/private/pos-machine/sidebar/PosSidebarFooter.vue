<template>
  <el-footer v-show="currentOrder.guid" class="bg-success" height="auto">
    <basic-purchase @showAdvancedPurchase="showAdvancedPurchase" ref="basicPurchase"/>
    <advanced-purchase v-if="currentOrder.guid" ref="advancedPurchaseDrawer"/>
  </el-footer>
</template>

<script>
  import {mapState} from "vuex";
  import AdvancedPurchase from "@/views/private/pos-machine/sidebar/footer/AdvancedPurchase";
  import BasicPurchase from "@/views/private/pos-machine/sidebar/footer/BasicPurchase";

  export default {
    name: "PosSidebarFooter",
    components: {BasicPurchase, AdvancedPurchase},
    computed: {
      ...mapState({
        currentOrder: state => state.posMachine.currentOrder,
      })
    },
    methods: {
      showAdvancedPurchase() {
        this.$refs.advancedPurchaseDrawer.show();
      }
    }
  };
</script>

<style lang="scss" scoped>
</style>
