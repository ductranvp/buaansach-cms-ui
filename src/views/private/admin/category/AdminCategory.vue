<template>
  <el-container direction="vertical">
    <sort-category-dialog @hasChange="hasChange" ref="sortDialog" />
    <el-row>
      <el-col :span="12">
        <el-form onsubmit="return false" ref="categoryForm" :rules="formRules" :model="form" :inline="true">
          <el-form-item prop="categoryName">
            <el-input @keypress.enter.native="submit" placeholder="Nhập tên danh mục"
                      v-model="form.categoryName">
            </el-input>
          </el-form-item>
          <el-button type="primary" :disabled="!form.categoryName" @click="submit">
            <span>Thêm Danh Mục</span>
          </el-button>
        </el-form>
      </el-col>
      <el-col :span="12" class="text-right">
        <el-button type="primary" @click="showSortDialog">
          <span>Sắp Xếp</span>
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <raw-data-table ref="categoryTable" :data="categories"
                      :default-sort="{prop: 'categoryPosition', order: 'ascending'}" show-index show-audit>
        <el-table-column label="Tên Danh Mục" prop="categoryName"></el-table-column>
        <el-table-column label="Thứ tự" prop="categoryPosition" sortable></el-table-column>
        <template slot="action">
          <el-table-column label="Thao tác">
            <template slot-scope="{row}">
              <el-button plain type="warning" size="mini" @click="editCategory(row)">
                <span>{{$t("common.entity.action.edit")}}</span>
              </el-button>

              <el-button plain type="danger" size="mini" @click="deleteCategory(row)">
                <span>{{$t("common.entity.action.delete")}}</span>
              </el-button>
            </template>
          </el-table-column>
        </template>
      </raw-data-table>
    </el-row>
  </el-container>
</template>

<script>
  import AdminCategoryService from "@/service/admin/admin.category.service";
  import RawDataTable from "@/components/raw-table-data/RawDataTable";
  import NotificationUtils from "@/utils/notification.util";
  import MessageBoxUtils from "@/utils/message-box.util";
  import AppUtils from "@/utils/app.util";
  import SortCategoryDialog from "@/views/private/admin/category/SortCategoryDialog";

  export default {
    name: "AdminCategory",
    components: {SortCategoryDialog, RawDataTable},
    data() {
      return {
        categories: [],
        form: {
          guid: null,
          categoryName: null,
          categoryDescription: null,
          categoryImageUrl: null,
          categoryPosition: null,
        },
        formRules: {
          categoryName: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"}
          ]
        }
      };
    },
    created() {
      this.getCategory();
    },
    methods: {
      async getCategory() {
        const {data} = await AdminCategoryService.getAllCategory();
        this.categories = data;
      },
      hasChange(value){
        if (value){
          this.getCategory();
        }
      },
      editCategory(category) {
        const vm = this;
        const originalName = category.categoryName;
        MessageBoxUtils.prompt("Sửa danh mục",
          "Nhập vào tên danh mục",
          false,
          category.categoryName,
          async function (callback) {
            category.categoryName = callback.value;
            try {
              const {data} = await AdminCategoryService.updateCategory(category);
              AppUtils.setAttrs(vm, category, data);
              NotificationUtils.success("Sửa danh mục thành công");
            } catch (error) {
              category.categoryName = originalName;
              NotificationUtils.error(error.message || error.data.message);
            }
          });
      },
      deleteCategory(category) {
        let vm = this;
        MessageBoxUtils.confirm(vm.$t("common.entity.delete.title"), async function () {
          try {
            await AdminCategoryService.deleteCategory(category.guid);
            vm.categories = vm.categories.filter(cat => cat.guid !== category.guid);
            NotificationUtils.success(vm.$t("common.entity.delete.success"));
          } catch (error) {
            NotificationUtils.error(error.message || error.data.message);
          }
        });
      },
      resetForm() {
        this.form = {};
        this.$refs.categoryForm.clearValidate();
        this.$refs.categoryForm.resetFields();
      },
      submit() {
        this.$refs.categoryForm.validate(async valid => {
          if (valid) {
            try {
              const {data} = await AdminCategoryService.createCategory(this.form);
              this.categories.push(data);
              NotificationUtils.success("Thêm danh mục thành công");
              this.resetForm();
            } catch (error) {
              NotificationUtils.error(error.message || error.data.message);
            }
          }
        });
      },
      showSortDialog(){
        this.$refs.sortDialog.show(this.categories);
      }
    }
  };
</script>

<style scoped>

</style>
