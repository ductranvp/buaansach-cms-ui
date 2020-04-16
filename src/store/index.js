import Vue from "vue";
import Vuex from "vuex";
import getters from "@/store/getters";
import AppModule from "./core/app";
import UserModule from "./core/user";
import TranslationModule from "./core/translation";
import AdminStoreModule from "./admin/admin-store";
import AdminSettingModule from "./admin/admin-setting";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app: AppModule,
    user: UserModule,
    translation: TranslationModule,
    adminStore: AdminStoreModule,
    adminSetting: AdminSettingModule,
  },
  getters
});
