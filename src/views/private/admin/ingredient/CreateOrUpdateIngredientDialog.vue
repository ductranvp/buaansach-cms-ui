<template>
  <el-dialog
    :before-close="beforeClose"
    :close-on-click-modal="false"
    :visible.sync="dialogFormVisible"
    title="Tạo hoặc sửa nguyên liệu"
  >
    <el-form ref="form" :model="form" :rules="formRules">
      <el-form-item>
        <el-row type="flex">
          <el-col :span="11">
            <el-form-item prop="ingredientName">
              <input-label label="Tên nguyên liệu" />
              <el-input v-model="form.ingredientName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset="2" :span="11">
            <el-form-item prop="ingredientUnit">
              <input-label label="Đơn vị" />
              <el-input v-model="form.ingredientUnit"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item>
        <el-row type="flex">
          <el-col :span="11">
            <el-form-item prop="ingredientPosition">
              <input-label label="Thứ tự" />
              <el-input v-model="form.ingredientPosition"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset="2" :span="11">
            <!--            <input-label label="Kích hoạt" required />-->
            <!--            <el-checkbox v-model="form.recipeActivated">-->
            <!--              <span v-if="form.recipeActivated">Bật</span>-->
            <!--              <span v-else>Tắt</span>-->
            <!--            </el-checkbox>-->
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item>
        <input-label label="Ảnh" optional />
        <single-image-uploader
          ref="singleImageUploader"
          :image-url-prop="getMediaUrl(form.ingredientImageUrl)"
          :show-clear-btn="false"
        />
      </el-form-item>
    </el-form>
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
import AppUtils from "@/utils/app.util";
import NotificationUtils from "@/utils/notification.util";
import AdminRecipeService from "@/service/admin/admin.recipe.service";
import AdminIngredientService from "@/service/admin/admin.ingredient.service";

export default {
  name: "CreateOrUpdateIngredientDialog",
  data() {
    return {
      dialogFormVisible: false,
      isEdit: false,
      isLoading: false,
      form: {
        ingredientName: null,
        ingredientUnit: null,
        ingredientImageUrl: null,
        ingredientPosition: null
      },
      formRules: {}
    };
  },
  methods: {
    create() {
      this.isEdit = false;
      this.form = {};
      this.show();
    },
    edit(data) {
      this.isEdit = true;
      this.form = {
        ...AppUtils.deepCopy(data)
      };
      this.show();
    },
    show() {
      this.dialogFormVisible = true;
    },
    hide() {
      this.resetForm();
      this.dialogFormVisible = false;
    },
    resetForm() {
      this.$refs.form.resetFields();
      this.$refs.form.clearValidate();
      this.$refs.singleImageUploader.clearImage();
    },
    beforeClose(done) {
      this.resetForm();
      done();
    },
    async submit() {
      try {
        this.isLoading = true;
        let image = this.$refs.singleImageUploader.getSelectedImage();
        if (this.isEdit) {
          await AdminIngredientService.updateIngredient(this.form, image);
        } else {
          await AdminIngredientService.createIngredient(this.form, image);
        }
        this.$emit("saved");
        this.hide();
      } catch (error) {
        NotificationUtils.error(error.message || error.data.message);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped></style>
