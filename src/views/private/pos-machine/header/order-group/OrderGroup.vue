<template>
  <el-dropdown @visible-change="visibleChange" trigger="click" :hide-on-click="false" placement="bottom">

    <el-button class="bg-yellowgreen no-border hidden-sm-and-down" size="small" type="success">
      <i class="el-icon-document-add"></i>
      <span class="hidden-md-and-down">Cộng dồn đơn</span>
    </el-button>
    <el-tooltip content="Bấm để tắt cộng dồn đơn" v-if="turnOnOrderGroup" class="hidden-sm-and-down">
      <el-tag size="small" type="success" class="pointer" @click.native="changeOrderGroupStatus(false)">
        <span>Đang bật</span>
      </el-tag>
    </el-tooltip>
    <el-tooltip content="Bấm để bật cộng dồn đơn" v-else class="hidden-sm-and-down">
      <el-tag size="small" type="danger" class="pointer" @click.native="changeOrderGroupStatus(true)">
        <span>Đã tắt</span>
      </el-tag>
    </el-tooltip>

    <el-dropdown-menu class="padding-10-0" slot="dropdown">
      <div v-if="turnOnOrderGroup" class="padding-5-10">
        <el-row type="flex" align="middle" class="row-item bg-light">
          <el-col :span="3">
            <span>TT</span>
          </el-col>
          <el-col :span="9">
            <span>Vị trí</span>
          </el-col>
          <el-col :span="2">
            <el-divider direction="vertical"></el-divider>
          </el-col>
          <el-col :span="10">
            <span>Thanh toán</span>
          </el-col>
        </el-row>
        <template v-for="(item, index) in orderGroups">
          <el-row type="flex" align="middle" :key="item.orderGuid" class="row-item text-small">
            <el-col :span="3">
              <span>{{index + 1}}</span>
            </el-col>
            <el-col :span="9">
              <span>{{item.seatName + " - " + item.areaName}}</span>
            </el-col>
            <el-col :span="2">
              <el-divider direction="vertical"></el-divider>
            </el-col>
            <el-col :span="10">
              <el-row type="flex" align="middle">
                <el-col><span>{{item.payAmount | priceAppend }}</span></el-col>
                <span>
                  <el-tooltip content="Xóa" placement="right">
                    <el-button @click="removeOrderGroup(item)" size="mini" circle>
                    <i class="el-icon-close"></i>
                  </el-button>
                  </el-tooltip>
                </span>
              </el-row>
            </el-col>
          </el-row>
        </template>
        <el-row type="flex" align="middle" class="row-item bg-yellowgreen">
          <el-col :span="11">
            <span>Tổng cộng</span>
          </el-col>
          <el-col :span="2">
            <el-divider direction="vertical"></el-divider>
          </el-col>
          <el-col :span="11">
            <span>{{totalPayment | priceAppend }}</span>
          </el-col>
        </el-row>
      </div>
      <el-row class="row-item">
        <el-input style="width: 350px !important;" ref="customerPay" v-model="customerPay" :disabled="!turnOnOrderGroup"
                  placeholder="Khách đưa">
          <i slot="prefix" class="el-input__icon el-icon-money"></i>
          <template slot="append">x1000</template>
        </el-input>
      </el-row>
      <el-row class="row-item" type="flex" align="middle">
        <el-button class="full-size text-left">
          <i class="el-icon-money"></i>
          <span>Trả lại: </span>
          <span v-if="customerPay*1000 > totalPayment">{{customerPay*1000 - totalPayment | priceAppend}}</span>
          <span v-else>0</span>
        </el-button>
      </el-row>
      <el-row v-if="turnOnOrderGroup" class="row-item" type="flex" align="middle">
        <el-button @click="changeOrderGroupStatus(false)" type="danger" class="full-size text-left">
          <i class="el-icon-close"></i>
          <span>Tắt cộng đồn đơn</span>
        </el-button>
      </el-row>
      <el-row v-else class="row-item" type="flex" align="middle">
        <el-button @click="changeOrderGroupStatus(true)" type="success" class="full-size text-left">
          <i class="el-icon-switch-button"></i>
          <span>Bật cộng đồn đơn</span>
        </el-button>
      </el-row>
    </el-dropdown-menu>
  </el-dropdown>

</template>

<script>
  import {mapState} from "vuex";
  import MessageBoxUtils from "@/utils/message-box.util";

  export default {
    name: "OrderGroup",
    computed: {
      ...mapState({
        turnOnOrderGroup: state => state.posMachine.turnOnOrderGroup,
        orderGroups: state => state.posMachine.orderGroups,
        totalPayment: state => {
          return state.posMachine.orderGroups.reduce((acc, item) => {
            return acc + item.payAmount;
          }, 0);
        }
      })
    },
    data() {
      return {
        toggleOrderGroup: localStorage,
        customerPay: null,
      };
    },
    watch: {
      turnOnOrderGroup: function (val) {
        this.toggleOrderGroup = val;
      }
    },
    methods: {
      removeOrderGroup(group) {
        this.$store.commit("posMachine/REMOVE_ORDER_GROUP", group);
      },
      visibleChange(status) {

      },
      async changeOrderGroupStatus(status) {
        if (!status) {
          try {
            await MessageBoxUtils.confirmPromise("Dữ liệu đang cộng dồn sẽ bị mất. Tiếp tục?");
            this.$store.commit("posMachine/SET_TURN_ON_ORDER_GROUP", status);
            this.resetAll();
          } catch (e) {
            // cancel
          }
        } else {
          this.$store.commit("posMachine/SET_TURN_ON_ORDER_GROUP", status);
        }
      },
      resetAll() {
        this.customerPay = null;
        this.$store.commit("posMachine/RESET_ALL");
      }
    }
  };
</script>

<style scoped>
  .row-item {
    padding: 5px 10px;
  }
</style>
