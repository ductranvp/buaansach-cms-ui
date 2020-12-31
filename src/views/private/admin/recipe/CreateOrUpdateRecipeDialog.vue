<template>
  <el-dialog
    :before-close="beforeClose"
    :close-on-click-modal="false"
    :visible.sync="dialogFormVisible"
    title="Tạo hoặc sửa công thức"
  >
    <el-form ref="form" :model="form" :rules="formRules">
      <el-form-item>
        <el-row type="flex">
          <el-col :span="11">
            <el-form-item prop="recipeName">
              <input-label label="Tên công thức" />
              <el-input v-model="form.recipeName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset="2" :span="11">
            <el-form-item prop="recipePosition">
              <input-label label="Thứ tự" />
              <el-input v-model="form.recipePosition"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item>
        <el-row type="flex">
          <el-col :span="11">
            <el-form-item prop="recipeDescription">
              <input-label label="Mô tả" />
              <el-input
                type="textarea"
                rows="4"
                v-model="form.recipeDescription"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset="2" :span="11">
            <input-label label="Kích hoạt" required />
            <el-checkbox v-model="form.recipeActivated">
              <span v-if="form.recipeActivated">Bật</span>
              <span v-else>Tắt</span>
            </el-checkbox>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item>
        <input-label label="Ảnh" required />
        <single-image-uploader
          ref="singleImageUploader"
          :image-url-prop="getMediaUrl(form.recipeImageUrl)"
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

export default {
  name: "CreateOrUpdateRecipeDialog",
  data() {
    return {
      dialogFormVisible: false,
      isEdit: false,
      isLoading: false,
      form: {
        recipeName: null,
        recipeDescription: null,
        recipeImageUrl: null,
        recipeActivated: null,
        recipePosition: null
      },
      formRules: {}
    };
  },
  methods: {
    create() {
      this.isEdit = false;
      this.form = {
        recipeActivated: true
      };
      this.show();
    },
    edit(banner) {
      this.isEdit = true;
      this.form = {
        ...AppUtils.deepCopy(banner)
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
          await AdminRecipeService.updateRecipe(this.form, image);
        } else {
          await AdminRecipeService.createRecipe(this.form, image);
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
