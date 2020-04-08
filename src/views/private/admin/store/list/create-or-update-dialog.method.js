import AdminStoreService from "@/service/admin/admin.store.service";
import AppUtils from "@/utils/app.util";
import NotificationUtils from "@/utils/notification.util";

const mixinMethod = {
  methods: {
    create() {
      this.form = {
        storeStatus: "ACTIVATED",
        storeOpenHour: null,
        storeCloseHour: null
      };
      this.show();
    },
    edit(store) {
      this.form = AppUtils.deepCopy(store);
      this.show();
    },
    dialogOpened() {
      this.$refs.storeCode.focus();
    },
    show() {
      this.dialogFormVisible = true;
    },
    hide() {
      this.resetForm();
      this.dialogFormVisible = false;
    },
    onImageCleared() {
      this.form.storeImageUrl = null;
    },
    beforeClose(done) {
      this.resetForm();
      done();
    },
    resetForm() {
      this.$refs.storeForm.resetFields();
      this.$refs.storeForm.clearValidate();
      this.$refs.singleImageUploader.clearImage();
    },
    submit() {
      let vm = this;
      this.$refs.storeForm.validate(async valid => {
        if (valid) {
          try {
            vm.isLoading = true;
            if (!vm.form.storeOpenHour) vm.form.storeCloseHour = null;
            let image = vm.$refs.singleImageUploader.getSelectedImage();
            if (!vm.form.guid) {
              await AdminStoreService.createStore(vm.form, image);
            } else {
              await AdminStoreService.updateStore(vm.form, image);
            }
            vm.isLoading = false;
            vm.$emit("storeSaved");
            NotificationUtils.success(vm.$t("common.entity.save.success"));
            vm.hide();
          } catch (error) {
            NotificationUtils.error(error.message || error.data.message);
          }
        }
      });
    }
  }
};

export default mixinMethod;
