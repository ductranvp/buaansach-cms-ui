<template>
  <el-main class="full-size" style="position: relative">
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
    <div class="mask" v-if="currentOrder.guid && currentOrder.orderStatus === 'CREATED'">
      <div class="mask-text">
        <span class="bg-warning text-white padding-10-15 text-bold" style="border-radius: 4px">Đang chờ tiếp nhận</span>
      </div>
    </div>
  </el-main>
</template>

<script>
  import {mapState} from "vuex";
  import SavedOrder from "@/views/private/pos/sidebar/main/modules/SavedOrder";
  import UnsavedOrder from "@/views/private/pos/sidebar/main/modules/UnsavedOrder";
  import CreateOrder from "@/views/private/pos/sidebar/main/modules/CreateOrder";

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

<style lang="scss" scoped>
  .mask {
    position: absolute;
    z-index: 2000;
    background-color: rgba(230, 162, 60, .2);
    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .mask-text {
    top: 50%;
    margin-top: -21px;
    width: 100%;
    text-align: center;
    position: absolute;
  }
</style>
