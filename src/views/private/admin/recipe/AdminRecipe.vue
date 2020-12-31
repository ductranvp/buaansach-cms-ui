<template>
  <el-container>
    <create-or-update-recipe-dialog ref="recipeDialog" @saved="getRecipes" />
    <el-header>
      <el-button @click="createRecipe" type="primary">Tạo mới</el-button>
    </el-header>
    <el-main>
      <raw-data-table v-loading="isLoading" :data="recipes" show-index>
        <el-table-column label="Hình ảnh">
          <template slot-scope="{ row }">
            <el-image
              style="width: 160px; height: 90px"
              fit="cover"
              :src="getMediaUrl(row.recipeImageUrl)"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="Tên" prop="recipeName"></el-table-column>
        <el-table-column
          label="Mô tả"
          prop="recipeDescription"
        ></el-table-column>
        <el-table-column label="Vị trí" prop="recipePosition"></el-table-column>
        <el-table-column
          label="Kích hoạt"
          prop="recipeActivated"
        ></el-table-column>
        <template slot="action">
          <el-table-column>
            <template slot-scope="{ row }">
              <el-button @click="editRecipe(row)" type="warning" size="mini"
                >Sửa</el-button
              >
              <el-button @click="deleteRecipe(row)" type="danger" size="mini"
                >Xóa</el-button
              >
            </template>
          </el-table-column>
        </template>
      </raw-data-table>
    </el-main>
  </el-container>
</template>

<script>
import CreateOrUpdateRecipeDialog from "@/views/private/admin/recipe/CreateOrUpdateRecipeDialog";
import RawDataTable from "@/components/raw-table-data/RawDataTable";
import AdminRecipeService from "@/service/admin/admin.recipe.service";
import ErrorUtils from "@/utils/error.util";
import MessageBoxUtils from "@/utils/message-box.util";

export default {
  name: "AdminRecipe",
  components: { RawDataTable, CreateOrUpdateRecipeDialog },
  data() {
    return {
      isLoading: false,
      recipes: []
    };
  },
  created() {
    this.getRecipes();
  },
  methods: {
    async getRecipes() {
      try {
        this.isLoading = true;
        const { data: recipes } = await AdminRecipeService.getRecipes();
        this.recipes = recipes;
      } catch (error) {
        ErrorUtils.showErrorMessage(error);
      } finally {
        this.isLoading = false;
      }
    },
    createRecipe() {
      this.$refs.recipeDialog.create();
    },
    editRecipe(recipe) {
      this.$refs.recipeDialog.edit(recipe);
    },
    async deleteRecipe(recipe) {
      await MessageBoxUtils.confirmPromise("Xác nhận xóa công thức!");
      try {
        await AdminRecipeService.deleteRecipe(recipe.guid);
        this.getRecipes();
      } catch (error) {
        ErrorUtils.showErrorMessage(error);
      }
    }
  }
};
</script>

<style scoped></style>
