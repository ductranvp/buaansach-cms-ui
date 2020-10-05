import Vue from "vue";
import Vuex from "vuex";
import getters from "@/store/getters";
import AppModule from "./app";
import UserModule from "./shared/user";
import TranslationModule from "./shared/translation";
import AdminStoreModule from "./admin/admin-store";
import AdminSettingModule from "./admin/admin-setting";
import WebSocketModule from "./websocket/websocket.store";
import PosMachineModule from "./pos/pos.store";
import CustomerCareModule from "./customer-care/customer-care.store";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app: AppModule,
    user: UserModule,
    translation: TranslationModule,
    adminStore: AdminStoreModule,
    adminSetting: AdminSettingModule,
    websocket: WebSocketModule,
    posMachine: PosMachineModule,
    customerCare: CustomerCareModule
  },
  getters
});

export default store;
