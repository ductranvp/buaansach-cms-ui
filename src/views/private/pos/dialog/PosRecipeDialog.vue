<template>
  <el-dialog
    :close-on-click-modal="true"
    :visible.sync="dialogFormVisible"
    width="95%"
    :show-close="false"
  >
    <div slot="title">
      <el-row type="flex" align="middle" justify="space-between">
        <div>Tỉ lệ suất ăn</div>
        <el-button type="danger">
          <span><b>Nước chấm lấy theo vạch đỏ</b></span>
        </el-button>
        <el-button @click="hide">
          <i class="el-icon-close"></i>
        </el-button>
      </el-row>
    </div>
    <el-main>
      <el-row>
        <el-col
          :span="4"
          class="padding-5"
          v-for="item in recipes"
          :key="item.guid"
        >
          <el-card
            style="border-width: 3px;"
            :body-style="{ padding: '0px' }"
            shadow="never"
          >
            <el-image
              class="recipe-image"
              :src="getMediaUrl(item.recipeImageUrl)"
            ></el-image>
            <div class="padding-5">
              <div class="text-large text-two-line">
                <b>{{ item.recipeName }}</b>
              </div>
              <div>
                <el-input
                  class="textarea"
                  type="textarea"
                  rows="3"
                  resize="none"
                  readonly
                  v-model="item.recipeDescription"
                ></el-input>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
    <div slot="footer">
      <el-button @click="hide">
        <span>{{ $t("common.entity.action.close") }}</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import AdminRecipeService from "@/service/admin/admin.recipe.service";
import ErrorUtils from "@/utils/error.util";
import PosRecipeService from "@/service/pos/pos.recipe.service";

export default {
  name: "PosRecipeDialog",
  data() {
    return {
      isEdit: false,
      isLoading: false,
      dialogFormVisible: false,
      recipes: []
    };
  },
  methods: {
    async getRecipes() {
      try {
        this.isLoading = true;
        const { data: recipes } = await PosRecipeService.getRecipes();
        this.recipes = recipes;
      } catch (error) {
        ErrorUtils.showErrorMessage(error);
      } finally {
        this.isLoading = false;
      }
    },
    show() {
      this.recipes = [];
      this.getRecipes();
      this.dialogFormVisible = true;
    },
    hide() {
      this.dialogFormVisible = false;
    }
  }
};
</script>

<style scoped>
.recipe-image {
  min-height: 120px;
}
.textarea {
  word-break: keep-all;
}
/deep/.el-textarea__inner {
  padding: 8px;
}
</style>
