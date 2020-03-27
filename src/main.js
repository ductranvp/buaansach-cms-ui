import Vue from "vue";

import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "element-ui/lib/theme-chalk/display.css";

import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import i18n from "@/i18n";

import "@/config/security/permission"; // permission control
import "@/components"; // import registered components
import "@/assets/styles/index.scss"; // all custom css here

import * as filters from "./filters"; // global filters
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.use(Element);

Vue.config.productionTip = false;

new Vue({
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount("#app");
