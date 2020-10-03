<template>
  <el-container class="full-size bg-success" direction="vertical">
    <el-header height="auto">
      <el-row class="padding-0-20" type="flex" align="middle">
        <el-col :span="8">
          <el-button size="medium" type="success" @click="$router.go(-1)">
            <i class="el-icon-arrow-left"></i>
            <span>Quay lại</span>
          </el-button>
        </el-col>
        <el-col :span="8" class="text-center">
          <h2 class="text-light">TẠO MÃ QR</h2>
        </el-col>
        <el-col :span="8"></el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-container class="full-size" direction="horizontal">
        <el-aside width="50%">
          <el-row class="full-size" type="flex" align="top" justify="center">
            <el-col :span="16">
              <el-form ref="qrForm" :model="form">
                <el-form-item prop="text">
                  <input-label effect="dark" label="Nội dung" required/>
                  <el-input type="textarea" rows="5" v-model="form.text" clearable/>
                </el-form-item>
                <el-form-item prop="qrSize">
                  <input-label effect="dark" label="Kích thước"/>
                  <el-input type="number" v-model="form.qrSize"/>
                </el-form-item>
                <el-form-item prop="qrMargin">
                  <input-label effect="dark" label="Canh Lề"/>
                  <el-input type="number" v-model="form.qrMargin"/>
                </el-form-item>
                <el-form-item>
                  <el-row>
                    <el-col :span="11">
                      <el-form-item>
                        <input-label effect="dark" label="Màu ma trận"/>
                        <el-color-picker
                          v-model="form.dark"
                          color-format="hex"
                          :predefine="predefineColors">
                        </el-color-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="2">
                      <el-form-item>
                        <input-label effect="dark" label="Màu nền"/>
                        <el-color-picker
                          v-model="form.light"
                          color-format="hex"
                          :predefine="predefineColors">
                        </el-color-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-aside>
        <el-main>
          <el-row class="full-size padding-20" type="flex" align="top" justify="center">
            <el-col :span="16">
              <el-form v-if="form.text">
                <el-form-item>
                  <div class="text-center">
                    <qrcode ref="qrcode" class="pointer" :value="form.text"
                            :options="{ logo: form.logo, width: form.qrSize, margin: form.qrMargin, color: {dark: form.dark, light: form.light} }"
                            tag="img"></qrcode>
                  </div>
                </el-form-item>
                <el-form-item>
                  <el-row>
                    <el-col :span="11">
                      <el-form-item>
                        <input-label effect="dark" label="Tên file"/>
                        <el-input v-model="form.name" clearable/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="2">
                      <el-form-item>
                        <input-label effect="dark" label="Đuôi mở rộng"/>
                        <el-input v-model="form.ext" clearable/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item>
                  <el-button @click="downloadImage()" class="full-width" type="warning">
                    <i class="el-icon-download"></i>
                    <span>Tải xuống</span>
                  </el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-main>

      </el-container>
    </el-main>
  </el-container>
</template>

<script>
  export default {
    name: "QRCreator",
    data() {
      return {
        form: {
          dark: "#000000",
          light: "#ffffff",
          text: "",
          qrSize: 200,
          qrMargin: 1,
          name: "qrcode",
          ext: ".png"
        },
        predefineColors: [
          '#000000',
          '#ffffff',
          '#ff4500',
          '#ff8c00',
          '#ffd700',
          '#90ee90',
          '#00ced1',
          '#1e90ff',
          '#c71585'
        ]
      };
    },
    methods: {
      downloadImage() {
        let link = document.createElement("a"); //Create <a>
        link.href = this.$refs.qrcode.$el.currentSrc; //Image Base64 Goes here
        link.download = this.form.name ? this.form.name + this.form.ext : 'qrcode.png'; //File name Here
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
    }
  };
</script>

<style scoped>

</style>
