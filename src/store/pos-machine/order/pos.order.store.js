/* Store module pattern */
import PosOrderService from "@/service/pos/pos.order.service";
import NotificationUtils from "@/utils/notification.util";
import MessageBoxUtils from "@/utils/message-box.util";
import MessageUtils from "@/utils/message.util";

const orderStatus = {
  CREATED_BY_CUSTOMER: "CREATED_BY_CUSTOMER",
  CREATED_BY_EMPLOYEE: "CREATED_BY_EMPLOYEE",
  RECEIVED: "RECEIVED",
  PURCHASED: "PURCHASED",
  CANCELLED_BY_EMPLOYEE: "CANCELLED_BY_EMPLOYEE",
  CANCELLED_BY_CUSTOMER: "CANCELLED_BY_CUSTOMER",
  CANCELLED_BY_SYSTEM: "CANCELLED_BY_SYSTEM",
};

const orderProductStatus = {
  WAITING: "WAITING",
  RECEIVED: "RECEIVED",
  PREPARING: "PREPARING",
  SERVED: "SERVED",
  CANCELLED_BY_EMPLOYEE: "CANCELLED_BY_EMPLOYEE",
  CANCELLED_BY_CUSTOMER: "CANCELLED_BY_CUSTOMER",
  CANCELLED_BY_SYSTEM: "CANCELLED_BY_SYSTEM",
};

const paymentMethod = [
  {label: "Tiền mặt", value: "CASH"},
  {label: "Thẻ tín dụng", value: "CREDIT_CARD"},
  {label: "Ví MoMo", value: "MOMO_APP"},
  {label: "Zalo Pay", value: "ZALO_PAY"},
  {label: "Viettel Pay", value: "VIETTEL_PAY"},
  {label: "VN Pay", value: "VN_PAY"},
];

const state = {
  selectedSeat: {},
  currentOrder: {},
  savedOrderProduct: [],
  unsavedOrderProduct: [],
  orderStatusChange: {
    orderGuid: null,
    orderStatus: null,
    paymentMethod: null,
    totalCharge: null,
    cancelReason: null
  },
  updateOrder: {
    orderGuid: null,
    listOrderProduct: null,
  },
  orderProduct: {
    orderGuid: null,
    productGuid: null,
    orderProductGroup: null,
    productCode: null,
    productName: null,
    orderProductQuantity: null,
    orderProductPrice: null,
    orderProductDiscount: null,
    orderProductNote: null,
    orderProductStatus: null,
    orderProductStatusTimeline: null,
    orderProductCancelReason: null,
  },
  orderStatus: orderStatus,
  paymentMethod: paymentMethod,
  orderProductStatus: orderProductStatus,
};
const mutations = {
  SET_CURRENT_ORDER(state, currentOrder) {
    state.currentOrder = currentOrder;
  },
  SET_SELECTED_SEAT(state, selectedSeat) {
    state.selectedSeat = selectedSeat;
  },
  SET_SAVED_ORDER_PRODUCT(state, savedOrderProduct) {
    state.savedOrderProduct = savedOrderProduct;
  },
  SET_UNSAVED_ORDER_PRODUCT(state, unsavedOrderProduct) {
    state.unsavedOrderProduct = unsavedOrderProduct;
  },
  ADD_ORDER_PRODUCT(state, {vm, orderProduct}) {
    const idx = state.unsavedOrderProduct.findIndex(item => item.productGuid === orderProduct.productGuid);
    if (idx !== -1) {
      const temp = state.unsavedOrderProduct[idx];
      temp.orderProductQuantity += 1;
      vm.$set(state.unsavedOrderProduct, idx, temp);
    } else {
      orderProduct.orderProductQuantity = 1;
      state.unsavedOrderProduct.push(orderProduct);
    }
  },
  RESET_ORDER(state) {
    state.currentOrder = {};
    state.savedOrderProduct = [];
    state.unsavedOrderProduct = [];
  }
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
  async createOrder({state, commit}, vm) {
    try {
      const {data} = await PosOrderService.createOrder({seatGuid: state.selectedSeat.guid});
      commit("SET_CURRENT_ORDER", data);
      commit("CHANGE_SEAT_STATUS", {seatGuid: state.selectedSeat.guid, status: 'NON_EMPTY', vm: vm});
    } catch (error) {
      NotificationUtils.error(error.message || error.data.message);
    }
  },
  async updateOrder({state, commit}) {
    try {
      let posOrderUpdate = {
        orderGuid: state.currentOrder.guid,
        listOrderProduct: state.unsavedOrderProduct
      };
      const {data} = await PosOrderService.updateOrder(posOrderUpdate);
      commit("SET_CURRENT_ORDER", data);
      commit("SET_SAVED_ORDER_PRODUCT", data.listOrderProduct);
      commit("SET_UNSAVED_ORDER_PRODUCT", []);
      NotificationUtils.success("Lưu đơn thành công");
    } catch (error) {
      NotificationUtils.error(error.message || error.data.message);
    }
  },
  async completeOrder({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      if (!state.savedOrderProduct.length) {
        MessageUtils.error("Chưa có sản phẩm nào trong đơn hàng");
        return;
      }
      const purchaseOrder = {
        orderGuid: state.currentOrder.guid,
        paymentMethod: payload.paymentMethod,
        totalCharge: payload.totalCharge,
      };
      PosOrderService.purchaseOrder(purchaseOrder).then(function () {
        NotificationUtils.success("Thanh toán thành công");
        commit("CHANGE_SEAT_STATUS", {vm: payload.vm, seatGuid: state.selectedSeat.guid, status: "EMPTY"});
        commit("RESET_ORDER");
        resolve();
      }, function (error) {
        NotificationUtils.error(error.message || error.data.message);
        reject();
      });
    });
  },
  executePosPrint({state}, payload) {

  },
  async cancelOrder({state, commit}, {vm, cancelReason}) {
    try {
      let orderChange = state.orderStatusChange;
      orderChange.orderGuid = state.currentOrder.guid;
      orderChange.cancelReason = cancelReason;
      await PosOrderService.cancelOrder(orderChange);
      NotificationUtils.success("Hủy đơn thành công");
      commit("CHANGE_SEAT_STATUS", {vm: vm, seatGuid: state.selectedSeat.guid, status: "EMPTY"});
      commit("RESET_ORDER");
    } catch (error) {
      NotificationUtils.error(error.message || error.data.message);
    }
  },
  async getSeatOrderInfo({commit}, seatGuid) {
    try {
      const {data} = await PosOrderService.getOrderBySeatGuid(seatGuid);
      if (data.guid) {
        commit("SET_CURRENT_ORDER", data);
        commit("SET_SAVED_ORDER_PRODUCT", data.listOrderProduct);
        commit("SET_UNSAVED_ORDER_PRODUCT", []);
      } else {
        commit("RESET_ORDER");
      }
    } catch (error) {
      NotificationUtils.error(error.message || error.data.message);
    }
  },
  addOrderProduct({state, commit}, {vm, storeProduct}) {
    /**
     * code check product status before add
     *
     * */
    const orderProduct = {
      orderGuid: null,
      productGuid: storeProduct.productGuid,
      orderProductGroup: null,
      productCode: storeProduct.productCode,
      productName: storeProduct.productName,
      orderProductQuantity: null,
      orderProductPrice: storeProduct.productNormalPrice,
      orderProductDiscount: storeProduct.productSalePrice,
      orderProductNote: null,
      orderProductStatus: state.orderProductStatus.PREPARING,
      orderProductStatusTimeline: null,
      orderProductCancelReason: null,
    };
    commit("ADD_ORDER_PRODUCT", {vm, orderProduct});
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
