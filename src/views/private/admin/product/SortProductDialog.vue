<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-press-escape="true"
    :modal="false"
    :fullscreen="true"
    :before-close="beforeClose"
    title="Sắp xếp sản phẩm"
    :destroy-on-close="true">
    <el-container v-loading="isLoading" class="full-width">
      <el-header height="auto">
        <el-row class="padding-10 bg-primary text-light text-bold text-large" type="flex" align="middle">
          <el-col :span="2">
            <span>STT</span>
          </el-col>
          <el-col :span="6">
            <span>Trọng số</span>
          </el-col>
          <el-col :span="7">
            <span>Mã sản phẩm</span>
          </el-col>
          <el-col :span="7">
            <span>Tên sản phẩm</span>
          </el-col>
        </el-row>
      </el-header>
      <el-main ref="sortableProduct">
        <el-row class="drag-item" type="flex" align="middle" v-for="(product, index) in products"
                :key="product.guid">
          <el-col :span="2">
            <div>{{index + 1}}</div>
          </el-col>
          <el-col :span="6">
            <div>{{product.productPosition}}</div>
          </el-col>
          <el-col :span="7">
            <div>{{product.productCode}}</div>
          </el-col>
          <el-col :span="7">
            <div>{{product.productName}}</div>
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
  import NotificationUtils from "@/utils/notification.util";
  import AdminProductService from "@/service/admin/admin.product.service";

  export default {
    name: "SortProductDialog",
    data() {
      return {
        hasChange: false,
        dialogVisible: false,
        isLoading: false,
        products: []
      };
    },
    methods: {
      async getProduct() {
        try {
          this.isLoading = true;
          const {data} = await AdminProductService.getAllProduct();
          this.products = data;
          this.isLoading = false;
        } catch (e) {
          NotificationUtils.error("Lỗi tải dữ liệu sản phẩm, vui lòng thử lại sau!");
        }
      },
      async show() {
        this.dialogVisible = true;
        await this.getProduct();
        this.$nextTick(() => {
          DragNDropUtils.setSortable(this, this.$refs.sortableProduct.$el, this.handleSort);
        });
      },
      async handleSort(evt) {
        if (evt.newIndex === evt.oldIndex) return;
        this.hasChange = true;
        const targetRow = this.products.splice(evt.oldIndex, 1)[0];
        this.products.splice(evt.newIndex, 0, targetRow);

        let current = this.products[evt.newIndex];
        let before = this.products[evt.newIndex - 1];
        let after = this.products[evt.newIndex + 1];

        let update = DragNDropUtils.getNewPos(current, before, after, "productPosition");
        targetRow.productPosition = update.newPos;

        try {
          this.isLoading = true;
          await AdminProductService.updateProductPosition(targetRow);
          if (update.updateList) {
            await AdminProductService.updateListProductPosition(this.products);
            await this.getProduct();
          }
          this.isLoading = false;
        } catch (e) {
          NotificationUtils.error("Lỗi sắp xếp vị trí sản phẩm, vui lòng thử lại sau!");
          this.getProduct();
        }
      },
      hide() {
        this.$emit("hasChange", this.hasChange);
        this.dialogVisible = false;
      },
      beforeClose(done) {
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
    padding: 10px;
  }

  .drag-item:last-child {
    border-bottom: 1px solid #eee;
  }
</style>
