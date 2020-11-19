<template>
  <el-header class="bg-success" height="50px">
    <el-row class="full-size" type="flex" align="middle">
      <el-col class="full-height">
        <el-button type="success" class="full-size no-border-radius">
          <span>{{currentStore.storeCode}}</span>
          <span> - </span>
          <span>{{currentStore.storeName | truncate(50)}}</span>
        </el-button>
      </el-col>
<!--      <el-button class="full-height no-border-radius" type="success" @click="reloadPage">F5</el-button>-->
    </el-row>
  </el-header>
</template>

<script>
  import {mapState} from 'vuex';

  export default {
    name: 'PosMobileHeader',
    computed: {
      ...mapState({
        currentStore: state => state.posMachine.currentStore,
      }),
    },
    methods: {
      reloadPage(){
        location.reload();
      }
    }
  };
</script>

<style scoped>

</style>