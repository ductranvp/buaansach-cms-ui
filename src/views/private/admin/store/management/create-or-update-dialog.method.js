import AdminStoreService from "@/service/admin/admin.store.service";
import AppUtils from "@/utils/app.util";
import NotificationUtils from "@/utils/notification.util";

const mixinMethod = {
  methods: {
    dialogOpened() {
      this.$refs.storeCode.focus();
    },
    create() {
      this.isEdit = false;
      this.form = {
        storeStatus: "OPENING",
        storeActivated: true,
        storeOpenHour: null,
        storeCloseHour: null
      };
      this.show();
    },
    edit(store) {
      this.isEdit = true;
      this.form = AppUtils.deepCopy(store);
      this.show();
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
            if (vm.form.guid && this.isEdit) {
              await AdminStoreService.updateStore(vm.form, image);
            } else {
              await AdminStoreService.createStore(vm.form, image);
            }
            vm.isLoading = false;
            vm.$emit("storeSaved");
            NotificationUtils.success(vm.$t("common.entity.save.success"));
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

export default mixinMethod;
