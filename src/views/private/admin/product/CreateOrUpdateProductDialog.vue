<template>
  <el-dialog
    ref="productDialog"
    :before-close="beforeClose"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :visible.sync="dialogFormVisible"
    @opened="onOpened"
    title="Thêm hoặc cập nhật sản phẩm"
  >
    <el-form
      ref="productForm"
      :model="form"
      :rules="formRules"
    >
      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="productName">
            <input-label label="Tên sản phẩm" required/>
            <el-input ref="productName" v-model="form.productName" maxlength="100" show-word-limit></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="11" :offset="2">
          <el-form-item prop="productUnit">
            <input-label label="Đơn vị" optional/>
            <el-input ref="productUnit" v-model="form.productUnit" maxlength="50" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item prop="productDescription">
        <input-label label="Mô tả" optional/>
        <el-input type="textarea" rows="5" v-model="form.productDescription" maxlength="2000"
                  show-word-limit></el-input>
      </el-form-item>

      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="productRootPrice">
            <input-label label="Giá gốc" optional/>
            <el-input v-model.number="form.productRootPrice" min="0" type="number"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="11" :offset="2">
          <el-form-item prop="productPrice">
            <input-label label="Giá bán" required/>
            <el-input v-model.number="form.productPrice" min="0" type="number"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="productStatus">
            <input-label label="Trạng thái" required/>
            <el-select v-model="form.productStatus" class="full-width">
              <el-option v-for="status in productStatus"
                         :key="status.value"
                         :label="status.label"
                         :value="status.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="11" :offset="2">
          <el-form-item prop="productType">
            <input-label label="Loại sản phẩm" required/>
            <el-select v-model="form.productType" class="full-width">
              <el-option v-for="type in productType"
                         :key="type.value"
                         :label="type.label"
                         :value="type.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="productDisplay">
            <input-label label="Hiển thị" required/>
            <el-select v-model="form.productDisplay" class="full-width">
              <el-option v-for="item in productDisplay"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item prop="categories">
            <input-label label="Danh mục" required/>
            <el-select multiple v-model="form.categories" class="full-width">
              <el-option v-for="category in categories"
                         :key="category.guid"
                         :label="category.categoryName"
                         :value="category.guid">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>


      <el-form-item>
        <input-label label="Hình minh họa (nên dùng ảnh tỉ lệ 1:1)" optional/>
        <single-image-uploader
          ref="singleImageUploader"
          @imageCleared="onImageCleared"
          :image-url-prop.sync="form.productImageUrl"
        />
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hide">
        <span>{{ $t("common.entity.action.cancel") }}</span>
      </el-button>
      <el-button type="primary" @click="submit" :loading="isLoading">
        <span>{{ $t("common.entity.action.save") }}</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import AppUtils from "@/utils/app.util";
  import NotificationUtils from "@/utils/notification.util";
  import AdminProductService from "@/service/admin/admin.product.service";
  import AdminCategoryService from "@/service/admin/admin.category.service";

  export default {
    name: "CreateOrUpdateProductDialog",
    data() {
      return {
        isLoading: false,
        dialogFormVisible: false,
        isEdit: false,
        categories: [],
        form: {
          guid: null,
          productCode: null,
          productName: null,
          productUnit: null,
          productDescription: null,
          productImageUrl: null,
          productThumbnailUrl: null,
          productStatus: null,
          productType: null,
          productDisplay: null,
          productRootPrice: null,
          productDiscount: null,
          productPrice: null,
          productPosition: null,
          productSaleGuid: null,
          categories: [],
        },
        formRules: {
          productName: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
            {max: 100, message: this.$t("common.entity.validation.maxlength", {max: 100}), trigger: "blur"}
          ],
          productUnit: [
            {max: 50, message: this.$t("common.entity.validation.maxlength", {max: 50}), trigger: "blur"}
          ],
          productDescription: [
            {max: 2000, message: this.$t("common.entity.validation.maxlength", {max: 2000}), trigger: "blur"}
          ],
          productStatus: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"}
          ],
          productDisplay: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"}
          ],
          productType: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"}
          ],
          productRootPrice: [
            {type: 'number', min: 0, message: this.$t("common.entity.validation.min", {min: 0}), trigger: "blur"}
          ],
          productPrice: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
            {type: 'number', min: 0, message: this.$t("common.entity.validation.min", {min: 0}), trigger: "blur"}
          ],
          categories: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"}
          ],
        },
        productStatus: [
          {label: "Có sẵn", value: "AVAILABLE"},
          {label: "Tạm hết hàng", value: "UNAVAILABLE"},
          {label: "Ngừng kinh doanh", value: "STOP_TRADING"}
        ],
        productType: [
          {label: "Sản phẩm chính", value: "MAIN_PRODUCT"},
          {label: "Sản phẩm phụ", value: "SUB_PRODUCT"},
        ],
        productDisplay: [
          {label: "Mặc định", value: "DEFAULT"},
          {label: "Hiện trên trang order", value: "ORDER_PAGE"},
        ]
      };
    },
    methods: {
      resetForm() {
        this.$refs.productForm.clearValidate();
        this.$refs.productForm.resetFields();
        this.$refs.singleImageUploader.clearImage();
      },
      onImageCleared() {
        this.form.productImageUrl = null;
      },
      create() {
        this.isEdit = false;
        this.form = {
          productStatus: "AVAILABLE",
          productType: "MAIN_PRODUCT",
          productDisplay: "DEFAULT"
        };
        this.show();
      },
      edit(product) {
        this.isEdit = true;
        let editProduct = AppUtils.deepCopy(product);
        editProduct.categories = product.categories.map(category => category.guid);
        this.form = editProduct;
        this.show();
      },
      async show() {
        this.dialogFormVisible = true;
        const {data} = await AdminCategoryService.getAllCategory();
        this.categories = data;
      },
      hide() {
        this.resetForm();
        this.dialogFormVisible = false;
      },
      beforeClose(done) {
        this.resetForm();
        done();
      },
      onOpened() {
        if (this.isEdit) this.$refs.productName.focus();
        else this.$refs.productCode.focus();
      },
      submit() {
        this.$refs.productForm.validate(async valid => {
          if (valid) {
            let image = this.$refs.singleImageUploader.getSelectedImage();
            try {
              this.isLoading = true;
              let payload = JSON.parse(JSON.stringify(this.form));
              payload.categories = this.categories.filter(category => this.form.categories.includes(category.guid));
              if (this.isEdit && this.form.guid) {
                await AdminProductService.updateProduct(payload, image);
              } else {
                await AdminProductService.createProduct(payload, image);
              }
              this.isLoading = false;
              this.$emit("productSaved");
              NotificationUtils.success(this.$t("common.entity.save.success"));
              this.hide();
            } catch (error) {
              this.isLoading = false;
              NotificationUtils.error(error.message || error.data.message);
            }
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
