<template>
  <el-container direction="vertical">
    <sort-category-dialog @hasChange="hasChange" ref="sortDialog" />
    <el-row class="padding-bottom-10">
      <el-col class="text-right">
        <el-button type="primary" @click="showCategoryDialogDialog()">
          <span>Tạo Mới</span>
        </el-button>
        <el-button type="primary" @click="showSortDialog">
          <span>Sắp Xếp</span>
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <raw-data-table ref="categoryTable" :data="categories"
                      :default-sort="{prop: 'categoryPosition', order: 'ascending'}">
        <el-table-column label="STT" type="index"></el-table-column>
        <el-table-column label="Tên Danh Mục (Tiếng Việt)" prop="categoryName"></el-table-column>
        <el-table-column label="Tên Danh Mục (Tiếng Anh)" prop="categoryNameEng"></el-table-column>
        <el-table-column label="Kích Hoạt" prop="categoryActivated">
          <template slot-scope="{row}">
            <el-tag v-if="row.categoryActivated" type="success">Bật</el-tag>
            <el-tag v-else type="danger">Tắt</el-tag>
          </template>
        </el-table-column>
        <template slot="action">
          <el-table-column label="Thao tác">
            <template slot-scope="{row}">
              <el-button plain type="warning" size="mini" @click="showCategoryDialogDialog(row)">
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
    <create-or-update-category-dialog ref="categoryDialog" @saved="getCategory" />
  </el-container>
</template>

<script>
  import AdminCategoryService from "@/service/admin/admin.category.service";
  import RawDataTable from "@/components/raw-table-data/RawDataTable";
  import NotificationUtils from "@/utils/notification.util";
  import MessageBoxUtils from "@/utils/message-box.util";
  import AppUtils from "@/utils/app.util";
  import SortCategoryDialog from "@/views/private/admin/category/SortCategoryDialog";
  import CreateOrUpdateCategoryDialog from "@/views/private/admin/category/CreateOrUpdateCategoryDialog";

  export default {
    name: "AdminCategory",
    components: {CreateOrUpdateCategoryDialog, SortCategoryDialog, RawDataTable},
    data() {
      return {
        categories: [],
        isLoading: false,
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
      deleteCategory(category) {
        let vm = this;
        MessageBoxUtils.confirm(vm.$t("common.entity.delete.title"), async function () {
          try {
            await AdminCategoryService.deleteCategory(category.guid);
            vm.getCategory();
          } catch (error) {
            NotificationUtils.error(error.message || error.data.message);
          }
        });
      },
      showCategoryDialogDialog(category){
        if (category){
          this.$refs.categoryDialog.edit(category);
        } else {
          this.$refs.categoryDialog.create(category);
        }
      },
      showSortDialog(){
        this.$refs.sortDialog.show(this.categories);
      }
    }
  };
</script>

<style scoped>

</style>
