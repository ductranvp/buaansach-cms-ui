<template>
  <el-footer height="40px">
    <el-row style="overflow: hidden" class="full-size" type="flex" align="middle" v-if="currentOrder.guid">
      <el-col class="full-height">
        <el-button :loading="isLoading" type="info" class="no-border no-border-radius full-size text-small"
                   @click="updateOrder"
                   size="small">
          <i class="fas el-icon-fa-save"></i>
          <span>Lưu danh sách</span>
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
    data() {
      return {
        isLoading: false,
      };
    },
    methods: {
      async updateOrder() {
        const vm = this;
        vm.isLoading = true;
        await this.$store.dispatch("posMachine/updateOrder");
        vm.isLoading = false;
      },
    }
  };
</script>

<style scoped>

</style>
