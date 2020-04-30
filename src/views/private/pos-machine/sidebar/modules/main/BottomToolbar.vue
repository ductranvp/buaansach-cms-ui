<template>
  <el-footer height="40px">
    <el-row class="full-size" type="flex" align="middle" v-if="currentOrder.guid">
      <el-col class="full-height">
        <el-button type="info" class="no-border no-border-radius full-size text-small"
                   @click="updateOrder"
                   size="small">
          <span>Lưu thông tin đơn hàng</span>
        </el-button>
      </el-col>
    </el-row>
  </el-footer>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "BottomToolbar",
        computed: {
            ...mapState({
                currentOrder: state => state.posMachine.currentOrder,
                unsavedOrderProduct: state => state.posMachine.unsavedOrderProduct,
            })
        },
        methods: {
            updateOrder() {
                this.$store.dispatch("posMachine/updateOrder");
            },
        }
    };
</script>

<style scoped>

</style>
