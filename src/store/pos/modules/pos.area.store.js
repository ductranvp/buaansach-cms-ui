/* Store module pattern */
import PosAreaService from "@/service/pos/pos.area.service";
import DefaultEntity from "@/utils/default-entity";


const state = {
  allAreas: [],
  selectedArea: DefaultEntity.area,
};

const mutations = {
  SET_ALL_AREA(state, allAreas) {
    state.allAreas = allAreas;
  },
  SET_SELECTED_AREA(state, areaGuid) {
    if (areaGuid === DefaultEntity.area.guid) {
      state.selectedArea = DefaultEntity.area;
      state.allAreas.forEach(area => {
        area.showSeats = true;
      });
    } else {
      state.allAreas.forEach(area => {
        area.showSeats = false;
        if (area.guid === areaGuid) {
          state.selectedArea = area;
          area.showSeats = true;
        }
      });
    }
  },
};
const actions = {
  async getAllArea({commit}, storeGuid) {
    const {data: areaData} = await PosAreaService.getListAreaWithSeatByStoreGuid(storeGuid);
    areaData.forEach(area => area.showSeats = true);

    let allSeats = [];
    areaData.forEach(area => {
      allSeats = allSeats.concat(area.listSeat);
    });

    commit("SET_ALL_AREA", areaData);
    commit("SET_ALL_SEAT", allSeats);

  },
  changeArea({commit, dispatch}, areaGuid) {
    commit("SET_SELECTED_AREA", areaGuid || DefaultEntity.area.guid);
  }
};

const PosAreaStore = {
  state,
  mutations,
  actions
};
export default PosAreaStore;
