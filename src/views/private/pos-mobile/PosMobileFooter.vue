<template>
  <el-footer class="bg-success" height="50px">
    <pos-mobile-seat-dialog ref="selectSeatDialog"/>
    <el-row type="flex" align="middle" class="full-height">
      <el-col class="full-height">
        <el-button :loading="isLoading" @click="reloadSeat" type="success" class="full-size no-border-radius">
          <i class="el-icon-refresh"></i>
          <span>Làm mới</span>
        </el-button>
      </el-col>
      <el-divider class="margin-0 full-height" direction="vertical"></el-divider>
      <el-col class="full-height">
        <el-button @click="showSelectSeatDialog" type="success" class="full-size no-border-radius">
          <i class="el-icon-thumb"></i>
          <span>Chọn bàn</span>
        </el-button>
      </el-col>
    </el-row>
  </el-footer>
</template>

<script>
  import PosMobileSeatDialog from '@/views/private/pos-mobile/header/PosMobileSeatDialog';
  import {mapState} from 'vuex';
  import ErrorUtils from '@/utils/error.util';

  export default {
    name: 'PosMobileFooter',
    components: {PosMobileSeatDialog},
    computed: {
      ...mapState({
        selectedSeat: state => state.posMachine.selectedSeat,
        currentStore: state => state.posMachine.currentStore,
      }),
    },
    data() {
      return {
        isLoading: false
      };
    },
    methods: {
      async reloadSeat(){
        if (!this.selectedSeat.guid) return;
        try {
          this.isLoading = true;
          await this.$store.dispatch('posMachine/reloadSeat', this.selectedSeat.guid);
        } catch (error) {
          ErrorUtils.showErrorMessage(error);
        } finally {
          this.isLoading = false;
        }
      },
      showSelectSeatDialog() {
        this.$refs.selectSeatDialog.show();
      },
    },
  };
</script>

<style scoped>

</style>