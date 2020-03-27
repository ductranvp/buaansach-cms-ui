<template>
  <el-upload
    ref="singleImageUploader"
    class="image-uploader"
    action="#"
    :auto-upload="false"
    :show-file-list="false"
    :limit="1"
    :on-change="handleAvatarChange"
  >
    <img v-if="displayImageUrl" :src="displayImageUrl" class="image" />
    <i v-else class="el-icon-plus image-uploader-icon"></i>
  </el-upload>
</template>

<script>
export default {
  name: "SingleImageUploader",
  props: {
    imageUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      file: null,
      selectedImage: null,
      displayImageUrl: null
    };
  },
  created() {
    setTimeout(this.reset(), 100);
  },
  methods: {
    clearThumbnail() {
      this.displayImageUrl = null;
      this.selectedImage = null;
      this.$refs["singleImageUploader"].clearFiles();
    },
    reset() {
      this.displayImageUrl = this.imageUrl;
    },
    getSelectedFile() {
      return this.selectedImage;
    },
    handleAvatarChange(file) {
      console.log("change");
      let vm = this;
      vm.selectedImage = file;
      this.displayImageUrl = URL.createObjectURL(file.raw);
      vm.$refs["singleImageUploader"].clearFiles();
    }
  }
};
</script>

<style scoped lang="scss">
/** use /deep/ combinator to add style to child components's classes. **/

.image-uploader {
  text-align: center;

  /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
  }

  /deep/ .el-upload:hover {
    border-color: #409eff;
  }

  .image-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .image {
    width: 178px;
    height: 178px;
    display: block;
  }

  .remove-icon {
    font-size: 23px;
    position: absolute;
    right: -10px;
    z-index: 1000;
    top: -6px;
    color: #293650 !important;
  }
}
</style>
