<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-press-escape="true"
    :modal="false"
    :before-close="beforeClose"
    title="Sắp xếp danh mục"
    :destroy-on-close="true">
    <el-container v-loading="isLoading" class="full-width">
      <el-header height="auto">
        <el-row class="padding-10-20 bg-primary text-light text-bold text-large" type="flex" align="middle">
          <el-col :span="11">
            <span>Vị trí</span>
          </el-col>
          <el-col :span="11">
            <span>Tên danh mục</span>
          </el-col>
        </el-row>
      </el-header>
      <el-main ref="sortable">
        <el-row class="drag-item" type="flex" align="middle" v-for="category in categories"
                :key="category.guid">
          <el-col :span="11">
            <div>{{category.categoryPosition}}</div>
          </el-col>
          <el-col :span="11">
            <div>{{category.categoryName}}</div>
          </el-col>
          <el-col :span="2" class="drag-handler text-right">
            <i class="el-icon-rank"></i>
          </el-col>
        </el-row>
      </el-main>
      <el-footer height="70px">
        <el-row type="flex" align="middle" justify="center" class="full-size">
          <el-button @click="hide">
            <span>{{ $t("common.entity.action.close") }}</span>
          </el-button>
        </el-row>
      </el-footer>
    </el-container>
  </el-dialog>
</template>

<script>
  import DragNDropUtils from "@/utils/dragndrop.util";
  import AdminCategoryService from "@/service/admin/admin.category.service";
  import NotificationUtils from "@/utils/notification.util";

  export default {
    name: "SortCategoryDialog",
    data() {
      return {
        hasChange: false,
        dialogVisible: false,
        isLoading: false,
        categories: []
      };
    },
    methods: {
      async getCategory() {
        try {
          this.isLoading = true;
          const {data} = await AdminCategoryService.getAllCategory();
          this.categories = data;
          this.isLoading = false;
        } catch (e) {
          NotificationUtils.error("Lỗi tải dữ liệu danh mục, vui lòng thử lại sau!");
        }
      },
      async show() {
        this.dialogVisible = true;
        await this.getCategory();
        this.$nextTick(() => {
          DragNDropUtils.setSortable(this, this.$refs.sortable.$el, this.handleSort);
        });
      },
      async handleSort(evt) {
        if (evt.newIndex === evt.oldIndex) return;
        this.hasChange = true;
        const targetRow = this.categories.splice(evt.oldIndex, 1)[0];
        this.categories.splice(evt.newIndex, 0, targetRow);

        let current = this.categories[evt.newIndex];
        let before = this.categories[evt.newIndex - 1];
        let after = this.categories[evt.newIndex + 1];

        let update = DragNDropUtils.getNewPos(current, before, after, "categoryPosition");
        targetRow.categoryPosition = update.newPos;

        try {
          this.isLoading = true;
          await AdminCategoryService.updateCategoryPosition(targetRow);
          if (update.updateList) {
            await AdminCategoryService.updateListCategoryPosition(this.categories);
            await this.getCategory();
          }
          this.isLoading = false;
        } catch (e) {
          NotificationUtils.error("Lỗi sắp xếp vị trí danh mục, vui lòng thử lại sau!");
          this.getCategory();
        }
      },
      hide() {
        this.$emit("hasChange", this.hasChange);
        this.dialogVisible = false;
      },
      beforeClose(done){
        this.$emit("hasChange", this.hasChange);
        done();
      }
    }
  };
</script>

<style scoped>
  .drag-item {
    border: 1px solid #eee;
    border-bottom: none;
    padding: 20px;
  }

  .drag-item:last-child {
    border-bottom: 1px solid #eee;
  }
</style>
