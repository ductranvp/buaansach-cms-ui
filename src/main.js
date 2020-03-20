import Vue from "vue";

import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "element-ui/lib/theme-chalk/display.css";

import App from "@/App.vue";
import router from "@/router";
import store from "@/store";

import "@/assets/styles/index.scss";
import "@/security/permission"; // permission control
import "@/directive";

import * as filters from "./filters"; // global filters
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.use(Element);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
