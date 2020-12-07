import QRCode from "easyqrcodejs";
import logoImage from "@/assets/images/logo_square.png";

// document: https://github.com/ushelp/EasyQRCodeJS#qrcode-api

function basicConfig() {
  return {
    correctLevel: QRCode.CorrectLevel.M,
    dotScale: 1.0, // 0-1.0
    quietZone: 10
  };
}

function colorConfig() {
  return {
    colorDark: "#00a54f",
    colorLight: "#ffffff",
    PO: "#771314",
    PI: "#F58020",
    PO_TL: undefined,
    PI_TL: undefined,
    PO_TR: undefined,
    PI_TR: undefined,
    PO_BL: undefined,
    PI_BL: undefined
  };
}

function logoConfig() {
  return {
    logo: logoImage,
    logoWidth: 64,
    logoHeight: 64,
    logoBackgroundTransparent: true,
    logoBackgroundColor: "#ffffff"
  };
}

function formatConfig() {
  return {
    drawer: "png" // canvas, svg
  };
}

function getConfig(hasLogo, customOption) {
  let config = {
    ...basicConfig(),
    ...colorConfig(),
    ...formatConfig()
  };
  if (hasLogo)
    config = {
      ...config,
      ...logoConfig()
    };
  return {
    ...config,
    ...customOption
  };
}

const QrCodeUtils = {
  colorConfig,
  getConfig
};
export default QrCodeUtils;
