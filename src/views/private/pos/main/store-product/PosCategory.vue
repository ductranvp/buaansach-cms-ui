<template>
  <el-container class="full-size">
    <el-header class="padding-0-10 bg-yellowgreen" height="40px">
      <el-row class="full-size" type="flex" align="middle">
        <span class="text-bold">Danh Mục</span>
      </el-row>
    </el-header>
    <el-main class="full-size">
      <el-menu class="full-height" :default-active="selectedCategory.guid">
        <el-menu-item :index="defaultCategory.guid" @click="changeCategory(defaultCategory.guid)">
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
  import Constants from "@/utils/constants";
  import DefaultEntity from "@/utils/default-entity";

  export default {
    name: "PosCategory",
    computed: {
      ...mapState({
        allCategories: state => state.posMachine.allCategories,
        selectedCategory: state => state.posMachine.selectedCategory,
      })
    },
    data() {
      return {
        defaultCategory: DefaultEntity.category
      };
    },
    methods: {
      changeCategory(categoryGuid) {
        this.$store.dispatch("posMachine/changeDisplayStoreProduct", categoryGuid);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .el-menu-item {
    height: 42px;
    line-height: 42px;
  }

  .el-menu-item.is-active {
    background: $--color-warning;
    color: white;
    font-weight: 700;
  }
</style>
