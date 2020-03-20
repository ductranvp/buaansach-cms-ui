import Vue from "vue";
import VueI18n from "vue-i18n";
import enMessage from "@/i18n/en";
import viMessage from "@/i18n/vi";

Vue.use(VueI18n);

let currentLang = process.env.VUE_APP_DEFAULT_LANG;
const i18n = new VueI18n({
  locale: currentLang,
  messages: {
    en: enMessage,
    vi: viMessage
  },
  fallbackLocale: "vi"
});

i18n.changeLang = lang => {
  currentLang = lang;
  i18n.locale = lang;
};

i18n.getCurrentLang = () => {
  return currentLang;
};

export default i18n;
