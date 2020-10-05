<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    title="Tạo hoặc sửa danh mục"
    :close-on-click-modal="false"
    :before-close="beforeClose"
    :destroy-on-close="true"
    @opened="onOpened"
  >
    <el-form ref="dialogForm" :model="form" :rules="formRules">
      <el-form-item prop="categoryName">
        <input-label label="Tên danh mục (Tiếng Việt)" required/>
        <el-input ref="categoryName" v-model="form.categoryName"></el-input>
      </el-form-item>

      <el-form-item prop="categoryNameEng">
        <input-label label="Tên danh mục (Tiếng Anh)" required/>
        <el-input v-model="form.categoryNameEng"></el-input>
      </el-form-item>

      <el-form-item prop="categoryHidden">
        <el-checkbox v-model="form.categoryHidden">
          <span>Ẩn</span>
        </el-checkbox>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="hide">
        <span>{{$t("common.entity.action.cancel")}}</span>
      </el-button>
      <el-button type="primary" @click="submit" :loading="isLoading">
        <span>{{$t("common.entity.action.save")}}</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import AppUtils from "@/utils/app.util";
  import NotificationUtils from "@/utils/notification.util";
  import AdminCategoryService from "@/service/admin/admin.category.service";

  export default {
    name: "CreateOrUpdateCategoryDialog",
    data() {
      return {
        isEdit: false,
        isLoading: false,
        dialogFormVisible: false,
        form: {
          guid: null,
          categoryName: null,
          categoryNameEng: null,
          categoryDescription: null,
          categoryDescriptionEng: null,
          categoryImageUrl: null,
          categoryThumbnailUrl: null,
          categoryPosition: null,
          categoryHidden: null,
        },
        formRules: {
          categoryName: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"}
          ],
          categoryNameEng: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"}
          ]
        }
      };
    },
    methods: {
      create() {
        this.isEdit = false;
        this.form = {};
        this.show();
      },
      edit(entity) {
        this.isEdit = true;
        this.form = AppUtils.deepCopy(entity);
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
        this.form = {};
        this.$refs.dialogForm.clearValidate();
        this.$refs.dialogForm.resetFields();
      },
      beforeClose(done) {
        this.resetForm();
        done();
      },
      onOpened(){
        this.$refs.categoryName.focus();
      },
      submit() {
        this.$refs.dialogForm.validate(async valid => {
          if (valid) {
            try {
              this.isLoading = true;
              if (this.isEdit) {
                await AdminCategoryService.updateCategory(this.form, null);
              } else {
                await AdminCategoryService.createCategory(this.form, null);
              }
              this.$emit("saved");
              this.resetForm();
              this.hide();
            } catch (error) {
              NotificationUtils.error(error.message || error.data.message);
            } finally {
              this.isLoading = false;
            }
          }
        });
      },
    }
  };
</script>

<style scoped>

</style>
