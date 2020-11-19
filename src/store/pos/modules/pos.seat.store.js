/* Store module pattern */
import MessageBoxUtils from '@/utils/message-box.util';
import PosSeatService from '@/service/pos/pos.seat.service';

const state = {
  allSeats: [],
  allSeatsObject: {},
  selectedSeat: {},
};
const mutations = {
  SET_ALL_SEAT(state, allSeats) {
    state.allSeats = allSeats;
    let allSeatsObject = {};
    allSeats.forEach(seat => {
      allSeatsObject[seat.guid] = seat;
    });
    state.allSeatsObject = allSeatsObject;
  },
  SET_SELECTED_SEAT(state, seatGuid) {
    state.selectedSeat = state.allSeats.find(seat => seat.guid === seatGuid) || {};
  },
  CHANGE_SEAT_STATUS(state, {targetSeat, seatStatus, seatServiceStatus}) {
    for (let i = 0; i < state.allAreas.length; i++) {
      let area = state.allAreas[i];
      if (area.guid === targetSeat.areaGuid) {
        const idx = area.listSeat.findIndex(seat => seat.guid === targetSeat.guid);
        if (idx !== -1) {
          area.listSeat[idx].seatStatus = seatStatus;
          area.listSeat[idx].seatServiceStatus = seatServiceStatus;
          area.listSeat.splice(idx, 1, area.listSeat[idx]);
          break;
        }
      }
    }
  },
  UPDATE_SEAT_INFO(state, targetSeat){
    for (let i = 0; i < state.allAreas.length; i++) {
      let area = state.allAreas[i];
      if (area.guid === targetSeat.areaGuid) {
        const idx = area.listSeat.findIndex(seat => seat.guid === targetSeat.guid);
        if (idx !== -1) {
          Object.assign(area.listSeat[idx], targetSeat);
          break;
        }
      }
    }
  },
  TOGGLE_LOCK(state) {
    state.selectedSeat.seatLocked = !state.selectedSeat.seatLocked;
  },
  SET_SEAT_LOCK(state, lock){
    state.selectedSeat.seatLocked = lock;
  },
  TOGGLE_LOCK_LIST(state, {listSeatGuid, locked}) {
    for (let i = 0; i < state.allAreas.length; i++) {
      let area = state.allAreas[i];
      for (let j = 0; j < area.listSeat.length; j++){
        let seat = area.listSeat[j];
        if (listSeatGuid.includes(seat.guid)){
          area.listSeat[j].seatLocked = locked;
          area.listSeat.splice(j, 1, area.listSeat[j]);
        }
      }
    }
  },
  TOGGLE_CHECK(state, targetSeat) {
    /* Cập nhật trạng thái cho ghế trong danh sách */
    for (let i = 0; i < state.allAreas.length; i++) {
      let area = state.allAreas[i];
      if (area.guid === targetSeat.areaGuid) {
        const idx = area.listSeat.findIndex(seat => seat.guid === targetSeat.guid);
        if (idx !== -1) {
          area.listSeat[idx].checked = !area.listSeat[idx].checked;
          area.listSeat.splice(idx, 1, area.listSeat[idx]);
          break;
        }
      }
    }
  },
};
const actions = {
  selectSeat({state, commit, dispatch}, seatGuid) {
    // clear active order product group
    commit('SET_ACTIVE_ORDER_PRODUCT_GROUP', null);

    if (state.unsavedOrderProduct.length) {
      MessageBoxUtils.confirm('Đơn hàng chưa được lưu, xác nhận đổi bàn?', function() {
        commit('SET_SELECTED_SEAT', seatGuid);
        dispatch('getSeatOrderInfo', seatGuid);
      });
    } else {
      commit('SET_SELECTED_SEAT', seatGuid);
      dispatch('getSeatOrderInfo', seatGuid);
    }
  },
  clearSeat({commit}) {
    commit('SET_SELECTED_SEAT', {});
    commit('RESET_ORDER');
    commit('RESET_ORDER_PRODUCT');
  },
  async reloadSeat({state, commit}, seatGuid) {
    const {data} = await PosSeatService.getSeat(seatGuid);
    commit('UPDATE_SEAT_INFO', data);
  },
  async toggleSeatLock({state, commit}) {
    await PosSeatService.toggleLock(state.selectedSeat.guid);
    commit('TOGGLE_LOCK');
  },
};

const PosSeatStore = {
  state,
  mutations,
  actions,
};
export default PosSeatStore;
