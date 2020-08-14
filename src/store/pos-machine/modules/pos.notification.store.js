/* Store module pattern */
import PosStoreOrderService from "@/service/pos/pos.store-order.service";

const state = {
  storeNotifications: [],
};

const mutations = {
  SET_STORE_NOTIFICATIONS(state, notifications) {
    state.storeNotifications = notifications;
  },
  ADD_NOTIFICATION(state, notification) {
    state.storeNotifications.push(notification);
  },
};
const actions = {
  async getStoreNotification({state, commit}, {storeGuid, startDate, hidden}) {
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
      item.title = arr[item.seatGuid].seatName + " - " + arr[item.seatGuid].areaName + " đã gọi món.";
      item.seat = arr[item.seatGuid];
      return item;
    });

    commit("SET_STORE_NOTIFICATIONS", data);
  }
};

const PosNotificationStore = {
  namespaced: true,
  state,
  mutations,
  actions
};

export default PosNotificationStore;
