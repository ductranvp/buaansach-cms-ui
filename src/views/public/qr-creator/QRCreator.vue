<template>
  <el-container class="full-size reset-container bg-success" direction="horizontal">
    <el-aside width="50%">
      <el-row class="full-size" type="flex" align="middle" justify="center">
        <el-col :span="14">
          <el-form ref="resetPasswordForm" :model="form">
            <el-form-item>
              <el-button @click="$router.go(-1)" class="full-width" type="info">Quay Lại</el-button>
            </el-form-item>
            <el-form-item prop="text">
              <input-label effect="dark" label="Nội dung" required/>
              <el-input type="textarea" rows="5" v-model="form.text"/>
            </el-form-item>
            <el-form-item prop="qrSize">
              <input-label effect="dark" label="Kích thước" required/>
              <el-input type="number" v-model="form.qrSize"/>
            </el-form-item>
            <el-form-item prop="qrMargin">
              <input-label effect="dark" label="Canh Lề" required/>
              <el-input type="number" v-model="form.qrMargin"/>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-aside>
    <el-main>
      <el-row class="full-size padding-20" type="flex" align="middle" justify="center">
        <el-col :span="14">
          <el-form>
            <el-form-item v-if="form.text">
              <div class="text-center">
                <qrcode ref="qrcode" class="pointer" :value="form.text"
                        :options="{ width: form.qrSize, margin: form.qrMargin }" tag="img"></qrcode>
              </div>
            </el-form-item>
            <el-form-item>
              <input-label effect="dark" label="Tên file tải xuống" optional/>
              <el-input v-model="form.name"/>
            </el-form-item>
            <el-form-item>
              <el-button @click="downloadImage()" class="full-width" type="warning">Tải xuống</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-main>

  </el-container>
</template>

<script>
  export default {
    name: "QRCreator",
    data() {
      return {
        isLoading: false,
        form: {
          text: "",
          name: null,
          qrSize: 200,
          qrMargin: 1
        },
        isSubmitted: false,
      };
    },
    methods: {
      truncate(string, maxlength) {
        if (string.length > maxlength) return string.substr(0, maxlength) + "...";
        return string;
      },
      downloadImage() {
        let link = document.createElement("a"); //Create <a>
        link.href = this.$refs.qrcode.$el.currentSrc; //Image Base64 Goes here
        link.download = this.form.name ? this.form.name + ".png" : 'qrcode.png'; //File name Here
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
    }
  };
</script>

<style scoped>

</style>
