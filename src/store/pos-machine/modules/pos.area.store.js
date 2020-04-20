/* Store module pattern */
import Constants from "@/utils/constants";

const state = {
  allAreas: [],
  selectedArea: {areaName: "Tất cả"},
  currentAreaGuid: localStorage.getItem("currentAreaGuid") ? JSON.parse(localStorage.getItem("currentAreaGuid")) : Constants.DEFAULT_AREA,

};
const mutations = {
  SET_AREA(state, allAreas) {
    state.allAreas = allAreas;
  },

  SET_CURRENT_AREA(state, currentAreaGuid) {
    state.currentAreaGuid = currentAreaGuid;
    if (currentAreaGuid === Constants.DEFAULT_AREA) state.selectedArea = {areaName: "Tất cả"};
    else state.selectedArea = state.allAreas.find(area => area.guid === currentAreaGuid);
    localStorage.setItem("currentAreaGuid", JSON.stringify(currentAreaGuid));
  },
};
const actions = {};

const PosAreaStore = {
  state,
  mutations,
  actions
};
export default PosAreaStore;
