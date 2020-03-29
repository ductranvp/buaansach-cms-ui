import Vue from "vue";
import VueI18n from "vue-i18n";
import enMessage from "@/i18n/en/en";
import viMessage from "@/i18n/vi/vi";
import store from "@/store";
import Constants from "@/utils/constants";

/* locale for element UI components */
import en from "element-ui/lib/locale/lang/en";
import vi from "element-ui/lib/locale/lang/vi";
import locale from "element-ui/lib/locale";

Vue.use(VueI18n);

let currentLang =
  localStorage.getItem("currentLanguage") || Constants.DEFAULT_LANGUAGE;

locale.use(currentLang === "en" ? en : vi);

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
  switch (lang) {
    case "en":
      locale.use(en);
      break;
    case "vi":
      locale.use(vi);
      break;
    default:
      locale.use(en);
  }
  localStorage.setItem("currentLanguage", lang);
  store.commit("translation/SET_LANGUAGE", lang, { root: true });
};

export default i18n;
