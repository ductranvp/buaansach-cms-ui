import Vue from "vue";
import Vuex from "vuex";
import getters from "@/store/getters";
import AppModule from "./modules/app";
import UserModule from "./modules/user";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app: AppModule,
    user: UserModule
  },
  getters
});
