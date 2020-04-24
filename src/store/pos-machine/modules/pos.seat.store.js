/* Store module pattern */
import Constants from "@/utils/constants";

const state = {
  allSeats: [],
  displaySeats: [],
};
const mutations = {
  SET_SEAT(state, allSeats) {
    state.allSeats = allSeats;
  },
  SET_DISPLAY_SEAT(state, displaySeats) {
    state.displaySeats = displaySeats;
  },
  CHANGE_SEAT_STATUS(state, {vm, seatGuid, status}) {
    const idx = state.allSeats.findIndex(seat => seat.guid === seatGuid);
    if (idx !== -1) {
      const foundedSeat = state.allSeats[idx];
      foundedSeat.seatStatus = status;
      vm.$set(state.allSeats, idx, foundedSeat);
    }
  }
};
const actions = {
  changeDisplaySeat({state, commit}, areaGuid) {
    let displaySeats;
    if (areaGuid === Constants.DEFAULT_AREA) displaySeats = state.allSeats;
    else displaySeats = state.allSeats.filter(seat => seat.areaGuid === areaGuid);
    commit("SET_CURRENT_AREA", areaGuid);
    commit("SET_DISPLAY_SEAT", displaySeats);
  },
};

const PosSeatStore = {
  state,
  mutations,
  actions
};
export default PosSeatStore;
