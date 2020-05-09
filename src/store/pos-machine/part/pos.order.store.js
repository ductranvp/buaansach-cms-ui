/* Store module pattern */
import PosOrderService from "@/service/pos/pos.order.service";
import NotificationUtils from "@/utils/notification.util";
import PosOrderStoreUtil from "@/store/pos-machine/util/pos.order.store.util";

const state = {
  currentOrder: {},
  orderStatus: PosOrderStoreUtil.orderStatus,
  paymentMethods: PosOrderStoreUtil.paymentMethods,
  customerPay: null,
};

const mutations = {
  SET_CUSTOMER_PAY(state, customerPay) {
    state.customerPay = customerPay;
  },
  SET_CURRENT_ORDER(state, currentOrder) {
    state.currentOrder = currentOrder;
  },
  RESET_ORDER(state) {
    state.currentOrder = {};
  }
};
const actions = {
  async createOrder({state, commit}, customerPhone) {
    const posCreateOrder = {
      seatGuid: state.selectedSeat.guid,
      customerPhone: customerPhone,
    };
    const {data} = await PosOrderService.createOrder(posCreateOrder);
    commit("SET_CURRENT_ORDER", data);
    commit("CHANGE_SEAT_STATUS", {
      targetSeat: state.selectedSeat,
      seatStatus: state.seatStatus.NON_EMPTY,
      seatServiceStatus: state.seatServiceStatus.FINISHED
    });
  },
  async updateOrder({state, commit}) {
    let posOrderUpdate = {
      orderGuid: state.currentOrder.guid,
      listOrderProduct: state.unsavedOrderProduct
    };
    const {data} = await PosOrderService.updateOrder(posOrderUpdate);
    console.log(data);
    commit("SET_CURRENT_ORDER", data);
    commit("SET_SAVED_ORDER_PRODUCT", data.listOrderProduct);
    commit("SET_UNSAVED_ORDER_PRODUCT", []);
    commit("CHANGE_SEAT_STATUS", {
      targetSeat: state.selectedSeat,
      seatStatus: state.seatStatus.NON_EMPTY,
      seatServiceStatus: state.seatServiceStatus.UNFINISHED
    });
  },
  async completeOrder({state, commit}, payload) {
    const posPurchaseOrder = {
      orderGuid: state.currentOrder.guid,
      paymentMethod: payload.paymentMethod,
      paymentNote: payload.paymentNote,
    };
    await PosOrderService.purchaseOrder(posPurchaseOrder);
  },
  printDone({commit, state}) {
    commit("CHANGE_SEAT_STATUS", {
      targetSeat: state.selectedSeat,
      seatStatus: state.seatStatus.EMPTY,
      seatServiceStatus: state.seatServiceStatus.FINISHED,
    });
    commit("RESET_ORDER");
    commit("RESET_ORDER_PRODUCT");
  },
  async changeOrderSeat({dispatch, state, commit}, newSeatGuid) {
    if (!newSeatGuid) return;
    const posOrderSeatChange = {
      currentSeatGuid: state.selectedSeat.guid,
      newSeatGuid: newSeatGuid,
      orderGuid: state.currentOrder.guid,
    };
    await PosOrderService.changeOrderSeat(posOrderSeatChange);
    commit("RESET_ORDER");
    commit("RESET_ORDER_PRODUCT");
  },
  async cancelOrder({state, commit}, cancelReason) {
    const orderChange = {
      orderGuid: state.currentOrder.guid,
      cancelReason: cancelReason
    };
    await PosOrderService.cancelOrder(orderChange);
    commit("CHANGE_SEAT_STATUS", {
      targetSeat: state.selectedSeat,
      seatStatus: state.seatStatus.EMPTY,
      seatServiceStatus: state.seatServiceStatus.FINISHED
    });
    commit("RESET_ORDER");
    commit("RESET_ORDER_PRODUCT");
  },
  async getSeatOrderInfo({commit}, seatGuid) {
    try {
      commit("SET_CUSTOMER_PAY", 0);
      const {data} = await PosOrderService.getSeatCurrentOrder(seatGuid);
      if (data.guid) {
        commit("SET_CURRENT_ORDER", data);
        commit("SET_SAVED_ORDER_PRODUCT", data.listOrderProduct);
        commit("SET_UNSAVED_ORDER_PRODUCT", []);
      } else {
        commit("RESET_ORDER");
        commit("RESET_ORDER_PRODUCT");
      }
    } catch (error) {
      NotificationUtils.error("Lấy thông tin đơn hàng thất bại, vui lòng thử lại");
    }
  },
};


const PosOrderStore = {
  namespaced: true,
  state,
  mutations,
  actions
};

export default PosOrderStore;
