<template>
  <el-container>
    <create-or-update-ingredient-dialog
      ref="ingredientDialog"
      @saved="getIngredients"
    />
    <el-header>
      <el-button type="primary" @click="createIngredient">Tạo mới</el-button>
    </el-header>
    <el-main>
      <raw-data-table v-loading="isLoading" :data="ingredients" show-index>
        <!--        <el-table-column label="Hình ảnh">-->
        <!--          <template slot-scope="{ row }">-->
        <!--            <el-image-->
        <!--              style="width: 160px; height: 90px"-->
        <!--              fit="cover"-->
        <!--              :src="getMediaUrl(row.recipeImageUrl)"-->
        <!--            ></el-image>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column label="Tên" prop="ingredientName"></el-table-column>
        <el-table-column label="Đơn vị" prop="ingredientUnit"></el-table-column>
        <el-table-column
          label="Vị trí"
          prop="ingredientPosition"
        ></el-table-column>
        <template slot="action">
          <el-table-column>
            <template slot-scope="{ row }">
              <el-button size="mini" type="warning" @click="editIngredient(row)"
                >Sửa
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="deleteIngredient(row)"
                >Xóa
              </el-button>
            </template>
          </el-table-column>
        </template>
      </raw-data-table>
    </el-main>
  </el-container>
</template>

<script>
import RawDataTable from "@/components/raw-table-data/RawDataTable";
import ErrorUtils from "@/utils/error.util";
import MessageBoxUtils from "@/utils/message-box.util";
import AdminIngredientService from "@/service/admin/admin.ingredient.service";
import CreateOrUpdateIngredientDialog from "@/views/private/admin/ingredient/CreateOrUpdateIngredientDialog";

export default {
  name: "AdminIngredient",
  components: {
    CreateOrUpdateIngredientDialog,
    RawDataTable
  },
  data() {
    return {
      isLoading: false,
      ingredients: []
    };
  },
  created() {
    this.getIngredients();
  },
  methods: {
    async getIngredients() {
      try {
        this.isLoading = true;
        const {
          data: ingredients
        } = await AdminIngredientService.getIngredients();
        this.ingredients = ingredients;
      } catch (error) {
        ErrorUtils.showErrorMessage(error);
      } finally {
        this.isLoading = false;
      }
    },
    createIngredient() {
      this.$refs.ingredientDialog.create();
    },
    editIngredient(recipe) {
      this.$refs.ingredientDialog.edit(recipe);
    },
    async deleteIngredient(item) {
      await MessageBoxUtils.confirmPromise("Xác nhận xóa!");
      try {
        await AdminIngredientService.deleteIngredient(item.guid);
        this.getIngredients();
      } catch (error) {
        ErrorUtils.showErrorMessage(error);
      }
    }
  }
};
</script>

<style scoped></style>
