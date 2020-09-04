/* Store module pattern */
import PosStoreOrderService from "@/service/pos/pos.store-order.service";

const state = {
  storeOrderNotifications: [],
};

const mutations = {
  SET_STORE_ORDER_NOTIFICATIONS(state, notifications) {
    state.storeOrderNotifications = notifications;
  },
  ADD_STORE_ORDER_NOTIFICATION(state, notification) {
    state.storeOrderNotifications.push(notification);
  },
};
const actions = {
  async getStoreOrderNotifications({state, commit}, {storeGuid, startDate, hidden}) {
    let params = {
      storeGuid: storeGuid,
      startDate: startDate,
      hidden: hidden
    };
    let {data} = await PosStoreOrderService.getListStoreOrder(params);

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

    commit("SET_STORE_ORDER_NOTIFICATIONS", data);
  }
};

const PosStoreOrderStore = {
  namespaced: true,
  state,
  mutations,
  actions
};

export default PosStoreOrderStore;
