<template>
  <el-main class="full-size">
    <el-container class="full-size" direction="vertical">
      <el-main v-if="selectedSeat.guid" class="scroll full-size show-vertical-scroll">
        <div v-if="currentOrder.guid" class="full-size">
          <saved-order/>
          <unsaved-order/>
        </div>
        <!--show when order is not created -->
        <div v-else class="full-size">
          <create-order/>
        </div>
      </el-main>

      <!--show when seat is not selected -->
      <el-main v-else class="full-size">
        <el-row class="full-size" type="flex" justify="center" align="middle">
          <el-col :span="14">
            <el-alert :closable="false" center effect="dark" type="warning">
              <span slot="title">Hãy chọn 1 bàn ăn</span>
            </el-alert>
          </el-col>
        </el-row>
      </el-main>

    </el-container>
  </el-main>
</template>

<script>
  import {mapState} from "vuex";
  import SavedOrder from "@/views/private/pos-machine/sidebar/modules/main/modules/SavedOrder";
  import UnsavedOrder from "@/views/private/pos-machine/sidebar/modules/main/modules/UnsavedOrder";
  import CreateOrder from "@/views/private/pos-machine/sidebar/modules/main/modules/CreateOrder";

  export default {
    name: "MainBodyLayout",
    components: {CreateOrder, UnsavedOrder, SavedOrder},
    computed: {
      ...mapState({
        selectedSeat: state => state.posMachine.selectedSeat,
        currentOrder: state => state.posMachine.currentOrder,
        unsavedOrderProduct: state => state.posMachine.unsavedOrderProduct,
      })
    },
    watch: {
      unsavedOrderProduct: function () {
        this.scrollToEnd();
      },
    },
    methods: {
      scrollToEnd() {
        let container = document.querySelector(".scroll");
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      },
    }
  };
</script>

<style scoped>

</style>
