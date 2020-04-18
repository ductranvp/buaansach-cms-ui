import PosSeatService from "@/service/pos/pos.seat.service";
import NotificationUtils from "@/utils/notification.util";

const state = {
  ready: false,
  seats: {},
  areas: {},
  products: {},
};
const mutations = {
  SET_READY(state, status) {
    state.ready = status;
  },
  SET_SEAT(state, status) {
    state.ready = status;
  },
  SET_AREA(state, status) {
    state.ready = status;
  },
  SET_PRODUCT(state, product) {
    state.ready = status;
  },
};
const actions = {
  async initState(store, storeGuid) {
    try {
      store.commit("SET_READY", false);
      const {data: seatData} = await PosSeatService.getListSeatByStoreGuid(storeGuid);
      console.log(seatData);
      store.commit("SET_READY", true);
    } catch (error) {
      NotificationUtils.error(error.message || error.data.message);
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
