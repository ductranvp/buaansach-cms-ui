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
    <el-row type="flex" class="mask" v-if="currentOrder.guid && currentOrder.orderStatus === orderStatus.CREATED">
      <el-row type="flex" align="middle" justify="center" class="mask-text">
        <el-col :span="16" class="bg-warning text-white padding-10 text-bold text-very-large" style="border-radius: 8px; line-height: 32px">
          <div>Nhìn qua vị trí ngồi </div>
          <div>trước khi tiếp nhận</div>
        </el-col>
      </el-row>
    </el-row>
  </el-main>
</template>

<script>
  import {mapState} from "vuex";
  import SavedOrder from "@/views/private/pos/sidebar/main/modules/SavedOrder";
  import UnsavedOrder from "@/views/private/pos/sidebar/main/modules/UnsavedOrder";
  import CreateOrder from "@/views/private/pos/sidebar/main/modules/CreateOrder";
  import OrderStatus from '@/enum/OrderStatus';

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
    data(){
      return  {
        orderStatus: OrderStatus.value
      };
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
    background-color: rgba(230, 162, 60, .4);
    margin: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .mask-text {
    top: 50%;
    margin-top: -36px;
    width: 100%;
    text-align: center;
    position: absolute;
  }
</style>
