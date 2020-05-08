/* Store module pattern */
import Constants from "@/utils/constants";
import PosAreaService from "@/service/pos/pos.area.service";

const defaultAreaEntity = {
  guid: Constants.DEFAULT_AREA_GUID,
  areaName: "Tất cả",
  areaColor: "gray",
};

const state = {
  allAreas: [],
  defaultArea: defaultAreaEntity,
  selectedArea: defaultAreaEntity,
};

const mutations = {
  SET_ALL_AREA(state, allAreas) {
    allAreas.forEach(area => area.display = true);
    state.allAreas = allAreas;
  },
  SET_SELECTED_AREA(state, areaGuid) {
    if (areaGuid === state.defaultArea.guid) {
      state.selectedArea = state.defaultArea;
      state.allAreas.forEach(area => {
        area.display = true;
      });
    } else {
      state.allAreas.forEach(area => {
        area.display = false;
        if (area.guid === areaGuid) {
          state.selectedArea = area;
          area.display = true;
        }
      });
    }
  },
};
const actions = {
  async getAllArea({commit}, storeGuid) {
    const areaData = await PosAreaService.getListAreaWithSeatByStoreGuid(storeGuid);
    commit("SET_ALL_AREA", areaData.data);
  },
  changeArea({commit, dispatch}, areaGuid) {
    commit("SET_SELECTED_AREA", areaGuid);
  }
};

const PosAreaStore = {
  state,
  mutations,
  actions
};
export default PosAreaStore;
