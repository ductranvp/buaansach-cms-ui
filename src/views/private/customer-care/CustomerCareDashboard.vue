<template>
  <el-container class="full-size">
    <el-main class="full-size padding-10">
      <el-row type="flex" align="middle" class="flex-wrap" :gutter="10">
        <el-col :span="4" v-for="item in titles" :key="item.routeName">
          <el-card shadow="hover" class="item-card pointer text-center padding-10 bg-success text-white" :class="item.className">
            <el-row @click.native="goTo(item.routeName)"  type="flex" align="middle" justify="center" class="full-size padding-10-0">{{item.title}}</el-row>
<!--            <el-button @click.native="goTo(item.routeName, true)"  size="small" class="full-width">Mở tab mới</el-button>-->
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
  export default {
    name: "CustomerCareDashboard",
    data() {
      return {
        titles: [
          {
            title: "Khuyến mãi cho khách hàng",
            routeName: "customerCareCustomerVoucherCodePage",
            className: "",
          },
          {
            title: "Khách hàng đã thanh toán",
            routeName: "customerCareCustomerOrderPurchasedPage",
            className: "",
          },
        ]
      };
    },
    methods: {
      goTo(routeName, openNewTab) {
        if (openNewTab) {
          let routeData = this.$router.resolve({name: routeName});
          window.open(routeData.href, '_blank');
        } else {
          this.$router.push({name: routeName});
        }
      },
    }
  };
</script>

<style scoped>
  .item-card {
    line-height: 30px;
    text-transform: uppercase;
    font-weight: 600;
  }
  /deep/.el-card__body{
    padding: 0 !important;
  }
</style>
