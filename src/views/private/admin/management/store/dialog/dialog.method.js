import StoreService from "@/service/store.service";
import AppUtils from "@/utils/app.util";
import NotificationUtils from "@/utils/notification.util";

const mixinMethod = {
  methods: {
    create() {
      this.storeEntity = {
        status: "ACTIVATED"
      };
      this.show();
    },
    edit(store) {
      this.storeEntity = AppUtils.deepCopy(store);
      this.$emit("update:imageUrl");
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
      this.storeEntity.imageUrl = null;
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
    getParams() {
      let vm = this;
      let params = new FormData();
      params.append(
        "entity",
        new Blob([JSON.stringify(vm.storeEntity)], { type: "application/json" })
      );
      let image = vm.$refs.singleImageUploader.getSelectedImage();
      if (image) {
        params.append("image", image.raw);
      } else {
        params.append("image", null);
      }
      return params;
    },
    submit() {
      let vm = this;
      this.$refs.storeForm.validate(valid => {
        if (valid) {
          vm.isSaving = true;
          const params = vm.getParams();
          if (vm.storeEntity.id === null || vm.storeEntity.id === undefined) {
            StoreService.createStore(params)
              .then(onSaveSuccess)
              .catch(onSaveError);
          } else {
            StoreService.updateStore(params)
              .then(onSaveSuccess)
              .catch(onSaveError);
          }
        }
      });

      function onSaveSuccess(response) {
        vm.isSaving = false;
        vm.$emit("storeSaved", response);
        NotificationUtils.success(
          vm.$t("private.adminStorePage.notification.saveSuccess")
        );
        vm.hide();
      }

      function onSaveError(error) {
        vm.isSaving = false;
        const message =
          error.message ||
          error.data.message ||
          vm.$t("private.adminStorePage.notification.saveError");
        NotificationUtils.error(vm.$t(message));
      }
    }
  }
};

export default mixinMethod;
