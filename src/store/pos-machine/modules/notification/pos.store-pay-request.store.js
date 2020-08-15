/* Store module pattern */
import PosStorePayRequestService from "@/service/pos/pos.store-pay-request.service";

const state = {
  storePayRequestNotifications: [],
};

const mutations = {
  SET_STORE_PAY_REQUEST_NOTIFICATIONS(state, notifications) {
    state.storePayRequestNotifications = notifications;
  },
  ADD_STORE_PAY_REQUEST_NOTIFICATION(state, notification) {
    state.storePayRequestNotifications.push(notification);
  },
};
const actions = {
  async getStorePayRequestNotifications({state, commit}, {storeGuid, startDate, hidden}) {
    let params = {
      storeGuid: storeGuid,
      startDate: startDate,
      hidden: hidden
    };
    let {data} = await PosStorePayRequestService.getListStorePayRequest(params);

    let arr = {};
    state.allAreas.forEach(area => {
      area.listSeat.forEach(seat => {
        arr[seat.guid] = seat;
      });
    });

    data = data.map(item => {
      item.title = arr[item.seatGuid].seatName + " - " + arr[item.seatGuid].areaName;
      item.seat = arr[item.seatGuid];
      return item;
    });

    commit("SET_STORE_PAY_REQUEST_NOTIFICATIONS", data);
  }
};

const PosStorePayRequest = {
  namespaced: true,
  state,
  mutations,
  actions
};

export default PosStorePayRequest;
