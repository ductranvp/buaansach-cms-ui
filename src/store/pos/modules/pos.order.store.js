/* Store module pattern */
import PosOrderService from '@/service/pos/pos.order.service';
import MessageUtils from '@/utils/message.util';
import SeatStatus from '@/enum/SeatStatus';
import SeatServiceStatus from '@/enum/SeatServiceStatus';

const state = {
  currentOrder: {},
  isLoadingOrder: false,
};

const mutations = {
  SET_CURRENT_ORDER(state, currentOrder) {
    state.currentOrder = currentOrder;
  },
  SET_IS_LOADING_ORDER(state, status) {
    state.isLoadingOrder = status;
  },
  RESET_ORDER(state) {
    state.currentOrder = {};
    state.isLoadingOrder = false;
  },
};
const actions = {
  async createOrder({state, commit}) {
    const payload = {
      seatGuid: state.selectedSeat.guid,
    };
    const {data} = await PosOrderService.createOrder(payload);
    commit('SET_CURRENT_ORDER', data);
    commit('CHANGE_SEAT_STATUS', {
      targetSeat: state.selectedSeat,
      seatStatus: SeatStatus.value.NON_EMPTY,
      seatServiceStatus: SeatServiceStatus.value.FINISHED,
    });
  },
  async updateOrder({state, commit}) {
    let posOrderUpdate = {
      orderGuid: state.currentOrder.guid,
      listOrderProduct: state.unsavedOrderProduct,
    };
    const {data} = await PosOrderService.updateOrder(posOrderUpdate);
    commit('SET_CURRENT_ORDER', data);
    commit('SET_SAVED_ORDER_PRODUCT', data.listOrderProduct);
    commit('SET_UNSAVED_ORDER_PRODUCT', []);
    commit('CHANGE_SEAT_STATUS', {
      targetSeat: state.selectedSeat,
      seatStatus: SeatStatus.value.NON_EMPTY,
      seatServiceStatus: SeatServiceStatus.value.UNFINISHED,
    });
  },
  async receiveOrder({state, dispatch}) {
    await PosOrderService.receiveOrder(state.currentOrder.guid);
    dispatch('getSeatOrderInfo', state.selectedSeat.guid);
  },
  async completeOrder({state, commit}, payload) {
    const posPurchaseOrder = {
      orderGuid: state.currentOrder.guid,
      orderPointValue: state.currentOrder.orderPointValue,
      paymentMethod: payload.paymentMethod,
      paymentNote: payload.paymentNote,
    };
    await PosOrderService.purchaseOrder(posPurchaseOrder);
  },
  printDone({commit, state}) {
    commit('CHANGE_SEAT_STATUS', {
      targetSeat: state.selectedSeat,
      seatStatus: SeatStatus.value.EMPTY,
      seatServiceStatus: SeatServiceStatus.value.FINISHED,
    });
    commit('SET_SEAT_LOCK', false);
    commit('RESET_ORDER');
    commit('RESET_ORDER_PRODUCT');
  },
  async changeOrderSeat({dispatch, state, commit}, newSeatGuid) {
    if (!newSeatGuid) return;
    const posOrderSeatChange = {
      currentSeatGuid: state.selectedSeat.guid,
      newSeatGuid: newSeatGuid,
      orderGuid: state.currentOrder.guid,
    };
    await PosOrderService.changeOrderSeat(posOrderSeatChange);

    // Khong can thiet vi sau khi chuyen cho da reload lai toan bo khu vuc
    // commit("CHANGE_SEAT_STATUS", {
    //   targetSeat: state.selectedSeat,
    //   seatStatus: SeatStatus.value.EMPTY,
    //   seatServiceStatus: SeatServiceStatus.value.FINISHED
    // });
    // commit('SET_SEAT_LOCK', false);
    commit('RESET_ORDER');
    commit('RESET_ORDER_PRODUCT');
  },
  async cancelOrder({state, commit}, cancelReason) {
    const orderChange = {
      orderGuid: state.currentOrder.guid,
      cancelReason: cancelReason,
    };
    await PosOrderService.cancelOrder(orderChange);
    commit('CHANGE_SEAT_STATUS', {
      targetSeat: state.selectedSeat,
      seatStatus: SeatStatus.value.EMPTY,
      seatServiceStatus: SeatServiceStatus.value.FINISHED,
    });
    commit('SET_SEAT_LOCK', false);
    commit('RESET_ORDER');
    commit('RESET_ORDER_PRODUCT');
  },
  async getSeatOrderInfo({commit, dispatch}, seatGuid) {
    commit('SET_IS_LOADING_ORDER', true);
    try {
      const {data} = await PosOrderService.getSeatOrder(seatGuid);
      if (data.guid) {
        commit('SET_CURRENT_ORDER', data);
        commit('SET_SAVED_ORDER_PRODUCT', data.listOrderProduct);
        commit('SET_UNSAVED_ORDER_PRODUCT', []);
      } else {
        commit('RESET_ORDER');
        commit('RESET_ORDER_PRODUCT');
      }
    } catch (error) {
      MessageUtils.error('Lấy thông tin đơn hàng thất bại, vui lòng thử lại');
    }
    setTimeout(() => {commit('SET_IS_LOADING_ORDER', false);}, 300);
    /* reload để tránh trường hợp dữ liệu client khác server*/
    dispatch('reloadSeat', seatGuid);
  },
};

const PosOrderStore = {
  namespaced: true,
  state,
  mutations,
  actions,
};

export default PosOrderStore;
