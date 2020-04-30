<template>
  <el-container class="full-size">
    <el-header class="padding-0-10 bg-yellowgreen" height="42px">
      <el-row class="full-size" type="flex" align="middle">
        <span class="text-bold">Danh Mục</span>
      </el-row>
    </el-header>
    <el-main class="full-size">
      <el-menu class="full-height" :default-active="currentCategoryGuid">
        <el-menu-item index="all" @click="changeCategory('all')">
          <span>Tất cả</span>
        </el-menu-item>
        <el-menu-item v-for="category in allCategories" :key="category.guid" :index="category.guid"
                      @click="changeCategory(category.guid)">
          <span>{{category.categoryName}}</span>
        </el-menu-item>
      </el-menu>
    </el-main>
  </el-container>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: "PosCategory",
    computed: {
      ...mapState({
        allCategories: state => state.posMachine.allCategories,
        currentCategoryGuid: state => state.posMachine.currentCategoryGuid
      })
    },
    data() {
      return {};
    },
    methods: {
      changeCategory(categoryGuid) {
        this.$store.dispatch("posMachine/changeDisplayStoreProduct", categoryGuid);
      }
    }
  };
</script>

<style scoped>
  .el-menu-item {
    height: 42px;
    line-height: 42px;
  }

  .el-menu-item.is-active {
    background: #e6a23c;
    color: white;
    font-weight: 700;
  }
</style>
