<template>
  <el-dialog
    ref="productIngredientDialog"
    :before-close="beforeClose"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :visible.sync="dialogFormVisible"
    title="Thêm hoặc cập nhật nguyên liệu của sản phẩm"
  >
    <el-form ref="productIngredientForm" :model="form" :rules="formRules">
      <el-form-item>
        <el-form-item prop="selectedIngredients">
          <input-label label="Chọn nguyên liệu" required />
          <el-select
            v-model="form.selectedIngredients"
            class="full-width"
            multiple
          >
            <el-option
              v-for="item in ingredients"
              :key="item.guid"
              :label="item.ingredientName"
              :value="item.guid"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
    </el-form>
    <div>
      <el-row
        v-for="item in form.selectedIngredients"
        :key="item"
        class="padding-bottom-10"
      >
        <el-col :span="10">
          <span>{{ ingredientsObject[item].ingredientName }}</span>
        </el-col>
        <el-col :offset="2" :span="10">
          <el-input
            size="small"
            v-model="form.amountForIngredient[item]"
            min="0"
            type="number"
          >
            <el-button slot="append">
              <span>{{ ingredientsObject[item].ingredientUnit }}</span>
            </el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hide">
        <span>{{ $t("common.entity.action.cancel") }}</span>
      </el-button>
      <el-button :loading="isLoading" type="primary" @click="submit">
        <span>{{ $t("common.entity.action.save") }}</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import AdminIngredientService from "@/service/admin/admin.ingredient.service";
import AdminProductIngredientService from "@/service/admin/admin.product-ingredient.service";
import ErrorUtils from "@/utils/error.util";

export default {
  name: "CreateOrUpdateProductIngredientDialog",
  data() {
    return {
      isLoading: false,
      dialogFormVisible: false,
      isEdit: false,
      ingredients: [],
      ingredientsObject: {},
      selectedProductGuid: null,
      form: {
        productGuid: null,
        listProductIngredient: [
          { productIngredientAmount: null, ingredientGuid: null }
        ],
        selectedIngredients: [],
        amountForIngredient: {}
      },
      formRules: {}
    };
  },
  methods: {
    create(productGuid) {
      this.selectedProductGuid = productGuid;
      this.ingredients = [];
      this.ingredientsObject = {};
      this.form = {
        productGuid: productGuid,
        listProductIngredient: [],
        selectedIngredients: [],
        amountForIngredient: {}
      };
      this.show();
    },
    async fillData() {
      try {
        const { data } = await AdminProductIngredientService.getByProduct(
          this.selectedProductGuid
        );
        data.forEach(productIngredient => {
          this.form.selectedIngredients.push(productIngredient.ingredientGuid);
          this.$set(
            this.form.amountForIngredient,
            productIngredient.ingredientGuid,
            productIngredient.productIngredientAmount
          );
        });
      } catch (error) {
        ErrorUtils.showErrorMessage(error);
      }
    },
    async show() {
      this.dialogFormVisible = true;
      const { data } = await AdminIngredientService.getIngredients();
      this.ingredients = data;
      this.ingredients.forEach(ingredient => {
        this.ingredientsObject[ingredient.guid] = ingredient;
      });
      this.fillData();
    },
    hide() {
      this.dialogFormVisible = false;
    },
    beforeClose(done) {
      done();
    },
    getPayload() {
      const payload = {};
      payload.productGuid = this.selectedProductGuid;
      payload.listProductIngredient = this.form.selectedIngredients.map(
        item => {
          return {
            ingredientGuid: item,
            productIngredientAmount: this.form.amountForIngredient[item]
          };
        }
      );
      return payload;
    },
    async submit() {
      try {
        this.isLoading = true;
        await AdminProductIngredientService.createByProduct(this.getPayload());
        this.hide();
      } catch (error) {
        ErrorUtils.showErrorMessage(error);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped></style>
