/* Store module pattern */
import PosStoreNotificationService from '@/service/pos/pos.store-notification.service';
import StoreNotificationType from '@/enum/StoreNotificationType';

const state = {
  callWaiterNotifications: [],
  payRequestNotifications: [],
  orderNotifications: [],
  activeNotificationGuid: null,
};

const mutations = {
  SET_ACTIVE_NOTIFICATION_GUID(state, guid) {
    state.activeNotificationGuid = guid;
  },
  RESET_STORE_NOTIFICATION(state) {
    state.callWaiterNotifications = [];
    state.payRequestNotifications = [];
    state.orderNotifications = [];
  },
  SET_CALL_WAITER_NOTIFICATIONS(state, notifications) {
    state.callWaiterNotifications = notifications;
  },
  ADD_CALL_WAITER_NOTIFICATION(state, notification) {
    state.callWaiterNotifications.push(notification);
  },
  SET_PAY_REQUEST_NOTIFICATIONS(state, notifications) {
    state.payRequestNotifications = notifications;
  },
  ADD_PAY_REQUEST_NOTIFICATION(state, notification) {
    state.payRequestNotifications.push(notification);
  },
  SET_ORDER_NOTIFICATIONS(state, notifications) {
    state.orderNotifications = notifications;
  },
  ADD_ORDER_NOTIFICATION(state, notification) {
    state.orderNotifications.push(notification);
  },
};
const actions = {
  async reloadAllStoreNotification({state, dispatch}){
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const payload = {
      storeGuid: state.currentStore.guid,
      listArea: Object.keys(state.allAreasObject).join(";"),
      startDate: startDate,
      type: null,
      hidden: null, // null means get all
    };
    await dispatch("getStoreNotifications", payload);
  },
  async getStoreNotifications({state, commit}, {storeGuid, listArea, startDate, type, hidden}) {
    let params = {
      storeGuid: storeGuid,
      listArea: listArea,
      startDate: startDate,
      type: type,
      hidden: hidden,
    };

    let {data} = await PosStoreNotificationService.getListStoreNotification(params);

    data.forEach(item => {
      const seatData = state.allSeatsObject[item.seatGuid];
      item.title = seatData.seatName + ' - ' + seatData.areaName;
    });

    switch (type) {
      case StoreNotificationType.value.ORDER_UPDATE:
        commit('SET_ORDER_NOTIFICATIONS', data);
        break;
      case StoreNotificationType.value.PAY_REQUEST:
        commit('SET_PAY_REQUEST_NOTIFICATIONS', data);
        break;
      case StoreNotificationType.value.CALL_WAITER:
        commit('SET_CALL_WAITER_NOTIFICATIONS', data);
        break;
      case null:
        commit('SET_ORDER_NOTIFICATIONS', data.filter(
          item => item.storeNotificationType ===
            StoreNotificationType.value.ORDER_UPDATE));
        commit('SET_CALL_WAITER_NOTIFICATIONS', data.filter(
          item => item.storeNotificationType ===
            StoreNotificationType.value.CALL_WAITER));
        commit('SET_PAY_REQUEST_NOTIFICATIONS', data.filter(
          item => item.storeNotificationType ===
            StoreNotificationType.value.PAY_REQUEST));
        break;
    }
  },
};

const PosStoreNotificationStore = {
  namespaced: true,
  state,
  mutations,
  actions,
};

export default PosStoreNotificationStore;
