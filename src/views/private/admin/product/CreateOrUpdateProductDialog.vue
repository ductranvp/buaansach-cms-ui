<template>
  <el-dialog
    ref="productDialog"
    :before-close="beforeClose"
    :close-on-click-modal="false"
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
          <el-form-item prop="productCode">
            <input-label label="Mã sản phẩm" required/>
            <el-input :disabled="isEdit" ref="productCode" v-model="form.productCode" maxlength="20"
                      show-word-limit></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="11" :offset="2">
          <el-form-item prop="productName">
            <input-label label="Tên sản phẩm" required/>
            <el-input ref="productName" v-model="form.productName" maxlength="100" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item prop="productDescription">
        <input-label label="Mô tả" optional/>
        <el-input type="textarea" rows="5" v-model="form.productDescription" maxlength="1000"
                  show-word-limit></el-input>
      </el-form-item>

      <el-form-item>
        <el-col :span="11">
          <el-form-item prop="productRealPrice">
            <input-label label="Giá gốc" required/>
            <el-input v-model="form.productRealPrice" type="number"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="11" :offset="2">
          <el-form-item prop="productName">
            <input-label label="Giá bán" required/>
            <el-input v-model="form.productPrice" type="number"></el-input>
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
          <el-form-item prop="categoryGuid">
            <input-label label="Danh mục" required/>
            <el-select v-model="form.categoryGuid" class="full-width">
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
          productDescription: null,
          productImageUrl: null,
          productThumbnailUrl: null,
          productStatus: null,
          productRealPrice: null,
          productPrice: null,
          categoryGuid: null,
        },
        formRules: {
          productCode: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
            {max: 20, message: this.$t("common.entity.validation.maxlength", {max: 20}), trigger: "blur"}
          ],
          productName: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
            {max: 100, message: this.$t("common.entity.validation.maxlength", {max: 100}), trigger: "blur"}
          ],
          productDescription: [
            {max: 1000, message: this.$t("common.entity.validation.maxlength", {max: 1000}), trigger: "blur"}
          ],
          productStatus: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"}
          ],
          productRealPrice: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"}
          ],
          productPrice: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"}
          ],
          categoryGuid: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"}
          ],
        },
        productStatus: [
          {label: "Đang kinh doanh", value: "ON"},
          {label: "Ngừng kinh doanh", value: "OFF"}
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
        this.form = {productStatus: "ON"};
        this.show();
      },
      edit(product) {
        this.isEdit = true;
        this.form = AppUtils.deepCopy(product);
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
              if (this.isEdit && this.form.guid) {
                await AdminProductService.updateProduct(this.form, image);
              } else {
                await AdminProductService.createProduct(this.form, image);
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
