import Vue from "vue";
import Vuex from "vuex";
import getters from "@/store/getters";
import AppModule from "./modules/app";
import UserModule from "./modules/user";
import TranslationModule from "./modules/translation";
import AdminStoreModule from "./modules/admin-store";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app: AppModule,
    user: UserModule,
    translation: TranslationModule,
    adminStore: AdminStoreModule,
  },
  getters
});
