<template>
  <el-row>
    <el-form :model="storeForm">
      <el-form-item prop="customCode" label="Code">
        <el-input v-model="storeForm.customCode"></el-input>
      </el-form-item>
      <el-form-item prop="name" label="Name">
        <el-input v-model="storeForm.name"></el-input>
      </el-form-item>
      <el-form-item prop="address" label="Address">
        <el-input v-model="storeForm.address"></el-input>
      </el-form-item>
      <el-form-item label="Image">
        <SingleImageUploader
          :imageUrl="storeForm.imageUrl ? storeForm.imageUrl : ''"
          ref="avatar"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="submit">Submit</el-button>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script>
import StoreService from "@/service/store.service";

export default {
  name: "AdminStoreManagement",
  data() {
    return {
      storeForm: {
        customCode: "BAS01",
        name: "Cửa hàng 1",
        address: "6 ngõ 46, Vĩnh Phúc, Ba Đình, Hà Nội",
        imageUrl: ""
      },
      selectedImage: null,
      isSaving: false
    };
  },
  methods: {
    submit() {
      let vm = this;
      vm.isSaving = true;
      vm.selectedImage = vm.$refs.avatar.getSelectedFile();
      let params = new FormData();
      params.append(
        "entity",
        new Blob([JSON.stringify(vm.storeForm)], { type: "application/json" })
      );
      if (vm.selectedImage) {
        params.append("image", vm.selectedImage.raw);
      } else {
        params.append("image", null);
      }
      StoreService.create(params)
        .then(response => {
          vm.isSaving = false;
          console.log(response);
        })
        .catch(error => {
          vm.isSaving = false;
          console.log(error);
        });
    }
  }
};
</script>

<style scoped></style>
