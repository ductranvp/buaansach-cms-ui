import Constants from "@/utils/constants";

const state = {
  /* check if user has change language before and saved in localStorage. If not, switch to default language*/
  currentLanguage: localStorage.getItem("currentLanguage") || Constants.DEFAULT_LANGUAGE,
  languages: {
    en: { name: "English", value: "en" },
    vi: { name: "Tiếng Việt", value: "vi" }
  }
};

const mutations = {
  SET_LANGUAGE(state, newLanguage) {
    state.currentLanguage = newLanguage;
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
