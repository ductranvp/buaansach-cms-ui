/* Store module pattern */
import PosOrderService from "@/service/pos/pos.order.service";
import NotificationUtils from "@/utils/notification.util";
import MessageBoxUtils from "@/utils/message-box.util";
import PosOrderProductService from "@/service/pos/pos.order-product.service";
import Constants from "@/utils/constants";
import MessageUtils from "@/utils/message.util";

const orderStatus = {
  CREATED: "CREATED",
  RECEIVED: "RECEIVED",
  PURCHASED: "PURCHASED",
  CANCELLED_BY_EMPLOYEE: "CANCELLED_BY_EMPLOYEE",
  CANCELLED_BY_CUSTOMER: "CANCELLED_BY_CUSTOMER",
  CANCELLED_BY_SYSTEM: "CANCELLED_BY_SYSTEM",
};

const orderProductStatus = {
  PREPARING: "PREPARING",
  SERVED: "SERVED",
  CANCELLED_BY_EMPLOYEE: "CANCELLED_BY_EMPLOYEE",
  CANCELLED_BY_CUSTOMER: "CANCELLED_BY_CUSTOMER",
  CANCELLED_BY_SYSTEM: "CANCELLED_BY_SYSTEM",
};

const paymentMethods = [
  {label: "Tiền mặt", value: "CASH"},
  {label: "Thẻ tín dụng", value: "CREDIT_CARD"},
  {label: "Ví MoMo", value: "MOMO_APP"},
  {label: "Zalo Pay", value: "ZALO_PAY"},
  {label: "Viettel Pay", value: "VIETTEL_PAY"},
  {label: "VN Pay", value: "VN_PAY"},
];

const state = {
  isLoadingSeatOrder: false,
  selectedSeat: {},
  currentSeatGuid: localStorage.getItem("currentSeatGuid") ? JSON.parse(localStorage.getItem("currentSeatGuid")) : null,
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
  paymentMethods: paymentMethods,
  orderProductStatus: orderProductStatus,
};
const mutations = {
  SET_IS_LOADING_SEAT_ORDER(state, status) {
    state.isLoadingSeatOrder = status;
  },
  SET_CURRENT_ORDER(state, currentOrder) {
    state.currentOrder = currentOrder;
  },
  SET_SELECTED_SEAT(state, selectedSeat) {
    state.selectedSeat = selectedSeat;
    state.currentSeatGuid = selectedSeat.guid;
    localStorage.setItem("currentSeatGuid", JSON.stringify(selectedSeat.guid));
  },
  SET_SAVED_ORDER_PRODUCT(state, savedOrderProduct) {
    state.savedOrderProduct = savedOrderProduct;
  },
  SET_UNSAVED_ORDER_PRODUCT(state, unsavedOrderProduct) {
    state.unsavedOrderProduct = unsavedOrderProduct;
  },
  SET_ORDER_PRODUCT_QUANTITY(state, {orderProduct, quantity}) {
    const idx = state.unsavedOrderProduct.findIndex(item => item.productGuid === orderProduct.productGuid);
    if (idx !== -1) {
      const temp = state.unsavedOrderProduct[idx];
      temp.orderProductQuantity = quantity;
      state.unsavedOrderProduct.splice(idx, 1, temp);
    } else {
      orderProduct.orderProductQuantity = quantity;
      state.unsavedOrderProduct.push(orderProduct);
    }
  },
  SET_ORDER_PRODUCT_STATUS(state, {orderProduct, status}) {
    const idx = state.savedOrderProduct.findIndex(item => item.guid === orderProduct.guid);
    if (idx !== -1) {
      const temp = state.savedOrderProduct[idx];
      temp.orderProductStatus = status;
      state.savedOrderProduct.splice(idx, 1, temp);
    }
  },
  REMOVE_UNSAVED_ORDER_PRODUCT(state, {orderProduct}) {
    const idx = state.unsavedOrderProduct.findIndex(item => item.productGuid === orderProduct.productGuid);
    if (idx !== -1) {
      state.unsavedOrderProduct.splice(idx, 1);
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
        commit("RESET_ORDER");
        dispatch("getSeatOrderInfo", seat.guid);
      });
    } else {
      commit("SET_SELECTED_SEAT", seat);
      dispatch("getSeatOrderInfo", seat.guid);
    }
  },
  async createOrder({state, commit}, payload) {
    try {
      payload.seatGuid = state.selectedSeat.guid;
      const {data} = await PosOrderService.createOrder(payload);
      commit("SET_CURRENT_ORDER", data);
      commit("CHANGE_SEAT_STATUS", {seatGuid: state.selectedSeat.guid, status: 'NON_EMPTY'});
    } catch (error) {
      NotificationUtils.error(error.message || error.data.message);
    }
  },
  async updateOrder({state, commit}) {
    try {
      const patt = new RegExp(Constants.PHONE_REGEX);
      if (state.currentOrder.customerPhone && !patt.test(state.currentOrder.customerPhone)) {
        MessageUtils.error("Số điện thoại không hợp lệ");
        return;
      }
      let posOrderUpdate = {
        orderGuid: state.currentOrder.guid,
        customerName: state.currentOrder.customerName,
        customerPhone: state.currentOrder.customerPhone,
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
      const purchaseOrder = {
        orderGuid: state.currentOrder.guid,
        paymentMethod: payload.paymentMethod,
        totalCharge: payload.totalCharge,
      };
      PosOrderService.purchaseOrder(purchaseOrder).then(function () {
        NotificationUtils.success("Thanh toán thành công");
        commit("CHANGE_SEAT_STATUS", {seatGuid: state.selectedSeat.guid, status: "EMPTY"});
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
  async changeOrderSeat({state, commit}, {newSeatGuid, storeGuid}) {
    const dto = {
      storeGuid: storeGuid,
      orderGuid: state.currentOrder.guid,
      currentSeatGuid: state.selectedSeat.guid,
      newSeatGuid: newSeatGuid,
    };
    return new Promise((resolve, reject) => {
      PosOrderService.changeOrderSeat(dto).then(function () {
        commit("SWAP_SEAT_STATUS", {seatAGuid: state.selectedSeat.guid, seatBGuid: newSeatGuid});
        commit("RESET_ORDER");
        NotificationUtils.success("Chuyển bàn thành công");
        resolve();
      }).catch(function (error) {
        NotificationUtils.error(error.message || error.data.message);
        reject();
      });
    });
  },
  async cancelOrder({state, commit}, cancelReason) {
    try {
      let orderChange = state.orderStatusChange;
      orderChange.orderGuid = state.currentOrder.guid;
      orderChange.cancelReason = cancelReason;
      await PosOrderService.cancelOrder(orderChange);
      NotificationUtils.success("Hủy đơn thành công");
      commit("CHANGE_SEAT_STATUS", {seatGuid: state.selectedSeat.guid, status: "EMPTY"});
      commit("RESET_ORDER");
    } catch (error) {
      NotificationUtils.error(error.message || error.data.message);
    }
  },
  async getSeatOrderInfo({commit}, seatGuid) {
    try {
      commit("SET_IS_LOADING_SEAT_ORDER", true);
      const {data} = await PosOrderService.getOrderBySeatGuid(seatGuid);
      if (data.guid) {
        commit("SET_CURRENT_ORDER", data);
        commit("SET_SAVED_ORDER_PRODUCT", data.listOrderProduct);
        commit("SET_UNSAVED_ORDER_PRODUCT", []);
      } else {
        commit("RESET_ORDER");
      }
      commit("SET_IS_LOADING_SEAT_ORDER", false);
    } catch (error) {
      commit("SET_IS_LOADING_SEAT_ORDER", false);
      NotificationUtils.error(error.message || error.data.message);
    }
  },
  addOrderProduct({state, commit}, {storeProduct}) {
    /**
     * code check product status before add
     *
     * */
    const orderProduct = storeProductToOrderProduct(state, storeProduct);
    const item = state.unsavedOrderProduct.find(item => item.productGuid === orderProduct.productGuid);
    let quantity = 1;
    if (item) quantity = Number(item.orderProductQuantity) + 1;
    commit("SET_ORDER_PRODUCT_QUANTITY", {orderProduct, quantity});
  },
  async serveOrderProduct({state, commit}, {vm, orderProduct, storeGuid}) {
    try {
      let orderProductChange = {
        storeGuid: storeGuid,
        orderProductGuid: orderProduct.guid,
      };
      await PosOrderProductService.serveOrderProduct(orderProductChange);
      NotificationUtils.success("Cập nhật thành công", 1000);
      commit("SET_ORDER_PRODUCT_STATUS", {
        orderProduct: orderProduct,
        status: state.orderProductStatus.SERVED
      });
    } catch (error) {
      NotificationUtils.error(error.message || error.data.message);
    }
  },
  async cancelOrderProduct({state, commit}, {vm, orderProduct, cancelReason, storeGuid}) {
    try {
      let orderProductChange = {
        storeGuid: storeGuid,
        orderProductGuid: orderProduct.guid,
        orderProductCancelReason: cancelReason
      };
      await PosOrderProductService.cancelOrderProduct(orderProductChange);
      NotificationUtils.success("Hủy món thành công");
      commit("SET_ORDER_PRODUCT_STATUS", {
        orderProduct: orderProduct,
        status: state.orderProductStatus.CANCELLED_BY_EMPLOYEE
      });
    } catch (error) {
      NotificationUtils.error(error.message || error.data.message);
    }
  },
  updateOrderProductQuantity({state, commit}, {vm, orderProduct, quantity}) {
    commit("SET_ORDER_PRODUCT_QUANTITY", {vm, orderProduct, quantity});
  }
};

function storeProductToOrderProduct(state, storeProduct) {
  return {
    guid: null,
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
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
