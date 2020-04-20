/* Store module pattern */
import Constants from "@/utils/constants";

const state = {
  allCategories: [],
  selectedCategory: {categoryName: "Tất cả"},
  currentCategoryGuid: localStorage.getItem("currentCategoryGuid") ? JSON.parse(localStorage.getItem("currentCategoryGuid")) : Constants.DEFAULT_CATEGORY,
};
const mutations = {
  SET_CATEGORY(state, allCategories) {
    state.allCategories = allCategories;
  },

  SET_CURRENT_CATEGORY(state, currentCategoryGuid) {
    state.currentCategoryGuid = currentCategoryGuid;
    if (currentCategoryGuid === Constants.DEFAULT_CATEGORY) state.selectedCategory = {categoryName: "Tất cả"};
    else state.selectedCategory = state.allCategories.find(category => category.guid === currentCategoryGuid);
    localStorage.setItem("currentCategoryGuid", JSON.stringify(currentCategoryGuid));
  }
};
const actions = {};

const PosCategoryStore = {
  state,
  mutations,
  actions
};
export default PosCategoryStore;
