import Vue from "vue";
import VueI18n from "vue-i18n";
import enMessage from "@/i18n/en/en";
import viMessage from "@/i18n/vi/vi";
import store from "@/store";
import Constants from "@/utils/constants";

Vue.use(VueI18n);

let currentLang =
  localStorage.getItem("currentLanguage") || Constants.DEFAULT_LANGUAGE;
const i18n = new VueI18n({
  locale: currentLang,
  messages: {
    en: enMessage,
    vi: viMessage
  },
  fallbackLocale: Constants.DEFAULT_LANGUAGE
});

i18n.changeLanguage = lang => {
  console.log("Change language to: " + lang);
  currentLang = lang;
  i18n.locale = lang;
  localStorage.setItem("currentLanguage", lang);
  store.commit("translation/SET_LANGUAGE", lang, { root: true });
};

export default i18n;
