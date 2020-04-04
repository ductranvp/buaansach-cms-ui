<template>
  <div :class="containerClass" class="text-center">
    <el-upload
      ref="uploadImage"
      drag
      :on-change="changeImage"
      :auto-upload="false"
      :multiple="false"
      :show-file-list="false"
      :limit="1"
      action="#"
    >
      <i v-if="displayImageUrl == null" class="el-icon-upload"></i>
      <div
        v-if="displayImageUrl == null"
        style="width: 100%"
        class="el-upload__text"
      >
        {{ $t("components.singleImageUploader.placeholder") }}
      </div>
      <img v-if="displayImageUrl" :src="displayImageUrl" class="image" alt="" />
    </el-upload>
    <el-button
      v-if="selectedImage != null || displayImageUrl != null"
      @click="clearImage"
      size="small"
      >{{ $t("components.singleImageUploader.clearBtn") }}
    </el-button>
  </div>
</template>

<script>
export default {
  name: "SingleImageUploader",
  props: {
    containerClass: Object,
    imageUrlProp: String
  },
  data() {
    return {
      selectedImage: null,
      displayImageUrl: this.imageUrlProp
    };
  },
  watch: {
    imageUrlProp: function(val) {
      this.displayImageUrl = val;
    }
  },
  methods: {
    changeImage(file) {
      let vm = this;
      vm.selectedImage = file;
      vm.$refs["uploadImage"].clearFiles();
      vm.displayImageUrl = URL.createObjectURL(vm.selectedImage.raw);
    },
    clearImage() {
      this.displayImageUrl = null;
      this.selectedImage = null;
      this.$refs["uploadImage"].clearFiles();
      this.$emit("imageCleared");
    },
    getSelectedImage() {
      return this.selectedImage;
    }
  }
};
</script>

<style scoped>
.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
/deep/.el-upload {
  width: 100%;
}

/deep/ .el-upload-dragger {
  width: 100%;
  height: 180px;
}
</style>
