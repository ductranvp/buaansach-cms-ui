<template>
  <el-drawer
    size="450px"
    :close-on-click-modal="false"
    :visible.sync="drawerVisible"
    :direction="direction"
    :show-close="false"
    @opened="onOpened"
    :before-close="beforeClose">
    <el-container class="full-size" direction="vertical">
      <el-header height="40px" class="bg-success">
        <el-row type="flex" align="middle" class="full-size text-light text-bold" justify="center">
          <span class="text-medium">Tùy chọn thanh toán</span>
        </el-row>
      </el-header>
      <el-main class="full-size padding-20">
        <el-form onsubmit="return false">
          <el-form-item>
            <el-row type="flex" align="bottom">
              <el-col :span="11">
                <input-label label="Mã giảm giá" optional/>
                <el-input ref="voucherCode"
                          @keyup.native.enter="applyVoucher"
                          v-model="voucherCode"></el-input>
              </el-col>
              <el-col :span="11" :offset="2">
                <el-button
                  @click="applyVoucher"
                  :loading="isLoading"
                  class="full-width"
                  type="success"
                  plain>
                  <span>Áp Dụng</span>
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-main>
      <el-footer height="auto" id="no_border">
        <el-row type="flex" align="middle">
          <el-button @click="hide" type="warning"
                     class="no-border-radius no-border full-width text-large padding-20-10">
            <i class="el-icon-close"></i>
            <span>Đóng (Esc)</span>
          </el-button>
        </el-row>
      </el-footer>
    </el-container>
  </el-drawer>
</template>

<script>
  import {mapState} from 'vuex';

  export default {
    name: 'AdvancedPurchase',
    computed: {
      ...mapState({
        currentOrder: state => state.posMachine.currentOrder,
        selectedSeat: state => state.posMachine.selectedSeat,
      }),
    },
    data() {
      return {
        isLoading: false,
        drawerVisible: false,
        direction: 'ltr',
        voucherCode: null,
      };
    },
    methods: {
      onOpened() {
        if (this.$refs.voucherCode)
          this.$refs.voucherCode.focus();
      },
      async applyVoucher() {

      },
      async cancelVoucher() {

      },
      show() {
        this.drawerVisible = true;
      },
      hide() {
        this.drawerVisible = false;
        this.resetForm();
      },
      resetForm() {
        this.voucherCode = null;
      },
      beforeClose(done) {
        this.resetForm();
        done();
      },
    },
  };
</script>

<style scoped>

</style>
