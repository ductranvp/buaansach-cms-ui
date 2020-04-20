/* Store module pattern */
import Constants from "@/utils/constants";

const state = {
  allSeats: [],
  selectedSeats: [],
};
const mutations = {
  SET_SEAT(state, allSeats) {
    state.allSeats = allSeats;
  },

  SET_SELECTED_SEAT(state, selectedSeats) {
    state.selectedSeats = selectedSeats;
  },
};
const actions = {
  changeSelectedSeat({state, commit}, areaGuid) {
    let displaySeats;
    if (areaGuid === Constants.DEFAULT_AREA) displaySeats = state.allSeats;
    else displaySeats = state.allSeats.filter(seat => seat.areaGuid === areaGuid);
    commit("SET_CURRENT_AREA", areaGuid);
    commit("SET_SELECTED_SEAT", displaySeats);
  },
};

const PosSeatStore = {
  state,
  mutations,
  actions
};
export default PosSeatStore;
