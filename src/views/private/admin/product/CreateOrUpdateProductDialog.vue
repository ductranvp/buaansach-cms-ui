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
          <el-form-item prop="productNameEng">
            <input-label label="Tên sản phẩm (Tiếng Anh)" required/>
            <el-input ref="productNameEng" v-model="form.productNameEng" maxlength="100" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="productUnit">
            <input-label label="Đơn vị" required/>
            <el-input ref="productUnit" v-model="form.productUnit" maxlength="50" show-word-limit></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="11" :offset="2">
          <el-form-item prop="productUnitEng">
            <input-label label="Đơn vị (Tiếng Anh)" required/>
            <el-input ref="productUnitEng" v-model="form.productUnitEng" maxlength="50" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="productDescription">
            <input-label label="Mô tả" optional/>
            <el-input type="textarea" rows="5" v-model="form.productDescription" maxlength="2000"
                      show-word-limit></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="11" :offset="2">
          <el-form-item prop="productDescriptionEng">
            <input-label label="Mô tả (Tiếng Anh)" optional/>
            <el-input type="textarea" rows="5" v-model="form.productDescriptionEng" maxlength="2000"
                      show-word-limit></el-input>
          </el-form-item>
        </el-col>
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
          <el-form-item prop="productActivated">
            <input-label label="Kích hoạt"/>
            <el-checkbox v-model="form.productActivated">
              <span v-if="form.productActivated">Bật</span>
              <span v-else>Tắt</span>
            </el-checkbox>
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
          :image-url-prop.sync="form.productThumbnailUrl"
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
  import ProductType from "@/enum/ProductType";
  import ProductStatus from "@/enum/ProductStatus";

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
          productNameEng: null,
          productUnit: null,
          productUnitEng: null,
          productDescription: null,
          productDescriptionEng: null,
          productImageUrl: null,
          productThumbnailUrl: null,
          productStatus: null,
          productType: null,
          productRootPrice: null,
          productPrice: null,
          productDiscount: null,
          productDiscountType: null,
          productPosition: null,
          productActivated: null,
          saleGuid: null,
          categories: [],
        },
        formRules: {
          productName: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
            {max: 100, message: this.$t("common.entity.validation.maxlength", {max: 100}), trigger: "blur"}
          ],
          productNameEng: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
            {max: 100, message: this.$t("common.entity.validation.maxlength", {max: 100}), trigger: "blur"}
          ],
          productUnit: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
            {max: 50, message: this.$t("common.entity.validation.maxlength", {max: 50}), trigger: "blur"}
          ],
          productUnitEng: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
            {max: 50, message: this.$t("common.entity.validation.maxlength", {max: 50}), trigger: "blur"}
          ],
          productDescription: [
            {max: 2000, message: this.$t("common.entity.validation.maxlength", {max: 2000}), trigger: "blur"}
          ],
          productDescriptionEng: [
            {max: 2000, message: this.$t("common.entity.validation.maxlength", {max: 2000}), trigger: "blur"}
          ],
          productStatus: [
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
        productStatus: ProductStatus.withLabel,
        productType: ProductType.withLabel
      };
    },
    methods: {
      resetForm() {
        this.$refs.productForm.clearValidate();
        this.$refs.productForm.resetFields();
        this.$refs.singleImageUploader.clearImage();
      },
      onImageCleared() {
        this.form.productThumbnailUrl = null;
      },
      create() {
        this.isEdit = false;
        this.form = {
          productStatus: ProductStatus.values.AVAILABLE,
          productType: ProductType.values.MAIN_PRODUCT,
          productActivated: true,
          categories: []
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
        if (!this.isEdit) this.$refs.productName.focus();
      },
      submit() {
        this.$refs.productForm.validate(async valid => {
          if (valid) {
            let image = this.$refs.singleImageUploader.getSelectedImage();
            try {
              this.isLoading = true;
              let payload = AppUtils.deepCopy(this.form);
              payload.categories = this.categories.filter(category => this.form.categories.includes(category.guid));
              if (this.isEdit && this.form.guid) {
                await AdminProductService.updateProduct(payload, image);
              } else {
                await AdminProductService.createProduct(payload, image);
              }
              this.$emit("saved");
              this.hide();
            } catch (error) {
              NotificationUtils.error(error.message || error.data.message);
            } finally {
              this.isLoading = false;
            }
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
