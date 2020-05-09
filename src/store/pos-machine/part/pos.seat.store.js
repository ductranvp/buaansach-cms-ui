/* Store module pattern */
import MessageBoxUtils from "@/utils/message-box.util";
import PosSeatService from "@/service/pos/pos.seat.service";

const state = {
  selectedSeat: {},
  seatStatus: {
    EMPTY: "EMPTY",
    NON_EMPTY: "NON_EMPTY",
    LOCKED: "LOCKED",
  },
  seatServiceStatus: {
    FINISHED: "FINISHED",
    UNFINISHED: "UNFINISHED",
  }
};
const mutations = {
  SET_SELECTED_SEAT(state, selectedSeat) {
    state.selectedSeat = selectedSeat;
  },
  CHANGE_SEAT_STATUS(state, {targetSeat, seatStatus, seatServiceStatus}) {
    if (seatStatus || seatServiceStatus)
      state.allAreas.forEach(area => {
        if (area.guid === targetSeat.areaGuid) {
          const idx = area.listSeat.findIndex(seat => seat.guid === targetSeat.guid);
          if (idx !== -1) {
            if (seatStatus) area.listSeat[idx].seatStatus = seatStatus;
            if (seatServiceStatus) area.listSeat[idx].seatServiceStatus = seatServiceStatus;
            area.listSeat.splice(idx, 1, area.listSeat[idx]);
          }
        }
      });
  },
};
const actions = {
  selectSeat({state, commit, dispatch}, seat) {
    if (state.unsavedOrderProduct.length) {
      MessageBoxUtils.confirm("Đơn hàng chưa được lưu, xác nhận đổi bàn?", function () {
        commit("SET_SELECTED_SEAT", seat);
        dispatch("getSeatOrderInfo", seat.guid);
      });
    } else {
      commit("SET_SELECTED_SEAT", seat);
      dispatch("getSeatOrderInfo", seat.guid);
    }
  },
  async reloadSeat({state, commit}, seatGuid) {
    const {data} = await PosSeatService.getSeat(seatGuid);
    commit("CHANGE_SEAT_STATUS", {
      targetSeat: data,
      seatStatus: data.seatStatus,
      seatServiceStatus: data.seatServiceStatus,
    });
  }
};

const PosSeatStore = {
  state,
  mutations,
  actions
};
export default PosSeatStore;
