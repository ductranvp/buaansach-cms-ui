<template>
  <div></div>
</template>

<script>
import * as QRCode from "easyqrcodejs";
import QrCodeUtils from "@/utils/qrcode.util";
export default {
  name: "QrCode",
  props: {
    text: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    hasLogo: Boolean,
    config: Object
  },
  data() {
    return {
      qrCode: null
    };
  },
  watch: {
    config() {
      this.reload();
    }
  },
  mounted() {
    this.createQr();
  },
  methods: {
    createQr() {
      const options = {
        ...QrCodeUtils.getConfig(this.hasLogo),
        ...this.config,
        text: this.text,
        width: this.size ? this.size : 200,
        height: this.size ? this.size : 200
      };
      this.qrCode = new QRCode(this.$el, options);
    },
    reload() {
      if (this.qrCode) {
        this.qrCode.clear();
        this.createQr();
      }
    }
  }
};
</script>

<style scoped></style>
