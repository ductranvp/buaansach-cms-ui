<template>
  <el-dialog
    title="Thêm hoặc cập nhật sản phẩm cho cửa hàng"
    :before-close="beforeClose"
    :destroy-on-close="true"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false">
    <el-form ref="storeProductForm" :model="form" :rules="formRules">

      <el-form-item>
        <el-col :span="11">
          <el-form-item v-show="isEdit">
            <el-input disabled v-model="form.productName"></el-input>
          </el-form-item>
          <el-form-item prop="productGuid" v-show="!isEdit">
            <el-select class="full-width" v-model="form.productGuid">
              <el-option v-for="product in productNotInStore"
                         :key="product.guid"
                         :value="product.guid"
                         :label="product.productName">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="11" :offset="2">
          <el-form-item prop="storeProductStatus">
            <el-select class="full-width" v-model="form.storeProductStatus">
              <el-option v-for="status in storeProductStatus"
                         :key="status.guid"
                         :value="status.value"
                         :label="status.label">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
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
  import AdminProductService from "@/service/admin/admin.product.service";
  import NotificationUtils from "@/utils/notification.util";
  import AppUtils from "@/utils/app.util";
  import AdminStoreProductService from "@/service/admin/admin.store-product.service";

  export default {
    name: "AddOrUpdateStoreProductDialog",
    data() {
      return {
        isEdit: false,
        isLoading: false,
        dialogFormVisible: false,
        storeProductStatus: [
          {label: "Còn hàng", value: "AVAILABLE"},
          {label: "Tạm hết hàng", value: "UNAVAILABLE"},
          {label: "Ngừng kinh doanh", value: "STOP_TRADING"},
        ],
        productNotInStore: [],
        form: {
          guid: null,
          storeProductStatus: "AVAILABLE",
          storeGuid: null,
          productGuid: null
        },
        formRules: {
          storeProductStatus: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
          ],
          productGuid: [
            {required: true, message: this.$t("common.entity.validation.required"), trigger: "blur"},
          ]
        }
      };
    },
    created() {

    },
    methods: {
      add() {
        this.isEdit = false;
        this.form = {storeProductStatus: 'AVAILABLE'};
        this.getProductNotInStore();
        this.show();
      },
      edit(storeProduct) {
        this.isEdit = true;
        this.productNotInStore = [];
        this.form = AppUtils.deepCopy(storeProduct);
        this.show();
      },
      async getProductNotInStore() {
        try {
          const {data} = await AdminProductService.getListProductNotInStore(this.$route.params.storeGuid);
          this.productNotInStore = data;
        } catch (error) {
          NotificationUtils.error(error.message || error.data.message);
        }
      },
      show() {
        this.dialogFormVisible = true;
      },
      hide() {
        this.resetForm();
        this.dialogFormVisible = false;
      },
      resetForm() {
        this.productNotInStore = [];
        this.form = {storeProductStatus: 'AVAILABLE'};
        this.$refs.storeProductForm.clearValidate();
        this.$refs.storeProductForm.resetFields();
      },
      beforeClose(done) {
        this.resetForm();
        done();
      },
      submit() {
        const vm = this;
        this.$refs.storeProductForm.validate(async valid => {
          if (valid) {
            try {
              vm.isLoading = true;
              vm.form.storeGuid = vm.$route.params.storeGuid;
              console.log(JSON.parse(JSON.stringify(vm.form)));
              if (vm.isEdit) {
                const {data} = await AdminStoreProductService.updateStoreProduct(vm.form);
                vm.$emit("onUpdated", data);
              } else {
                const {data} = await AdminStoreProductService.addStoreProduct(vm.form);
                vm.$emit("onCreated", data);
              }
              NotificationUtils.success(vm.$t("common.entity.save.success"));
              vm.isLoading = false;
              vm.hide();
            } catch (error) {
              vm.isLoading = false;
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
