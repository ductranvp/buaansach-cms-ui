import Vue from "vue";

import Element from "element-ui";

import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import i18n from "@/i18n";

import VueMoment from "vue-moment";

import VueQrCode from '@chenfengyuan/vue-qrcode';
import "@/config/security/permission"; // permission control
import "@/components"; // import registered components
import "@/assets/styles/index.scss"; // all custom css here
import * as filters from "./filters"; // global filters
Vue.component(VueQrCode.name, VueQrCode);

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.use(Element);
Vue.use(VueMoment);

Vue.config.productionTip = false;

new Vue({
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount("#app");
