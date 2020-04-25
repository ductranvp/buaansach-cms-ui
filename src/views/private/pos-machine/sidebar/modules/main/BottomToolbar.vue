<template>
  <el-footer height="40px">
    <el-row class="full-size padding-0-10" type="flex" align="middle" v-if="currentOrder.guid">
      <el-col>
        <el-button v-if="unsavedOrderProduct.length" type="info" class="full-width" @click="updateOrder"
                   size="small">
          <span>Lưu đơn hàng</span>
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
