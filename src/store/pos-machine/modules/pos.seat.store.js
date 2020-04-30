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
  CHANGE_SEAT_STATUS(state, {seatGuid, status}) {
    const idx = state.allSeats.findIndex(seat => seat.guid === seatGuid);
    if (idx !== -1) {
      const foundedSeat = state.allSeats[idx];
      foundedSeat.seatStatus = status;
      state.allSeats.splice(idx, 1, foundedSeat);
    }
  },
  SWAP_SEAT_STATUS(state, {seatAGuid, seatBGuid}) {
    const idxA = state.allSeats.findIndex(seat => seat.guid === seatAGuid);
    const idxB = state.allSeats.findIndex(seat => seat.guid === seatBGuid);
    if (idxA !== -1 && idxB !== -1) {
      const seatA = state.allSeats[idxA];
      const seatB = state.allSeats[idxB];
      const temp = {
        seatStatus: seatA.seatStatus,
        currentOrderGuid: seatA.currentOrderGuid,
      };
      seatA.seatStatus = seatB.seatStatus;
      seatA.currentOrderGuid = seatB.currentOrderGuid;

      seatB.seatStatus = temp.seatStatus;
      seatB.currentOrderGuid = temp.currentOrderGuid;

      state.allSeats.splice(idxA, 1, seatA);
      state.allSeats.splice(idxB, 1, seatB);
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
