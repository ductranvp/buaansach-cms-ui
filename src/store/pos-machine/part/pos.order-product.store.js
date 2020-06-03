/* Store module pattern */
import PosOrderStoreUtil from "@/store/pos-machine/util/pos.order.store.util";
import PosOrderProductService from "@/service/pos/pos.order-product.service";
import NotificationUtils from "@/utils/notification.util";
import MessageUtils from "@/utils/message.util";

const state = {
  savedOrderProduct: [],
  unsavedOrderProduct: [],
  orderProductStatus: PosOrderStoreUtil.orderProductStatus,
};
const mutations = {
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
  SET_ORDER_PRODUCT_NOTE(state, {orderProduct, note}) {
    const idx = state.unsavedOrderProduct.findIndex(item => item.productGuid === orderProduct.productGuid);
    if (idx !== -1) {
      const temp = state.unsavedOrderProduct[idx];
      temp.orderProductNote = note;
      state.unsavedOrderProduct.splice(idx, 1, temp);
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
  RESET_ORDER_PRODUCT(state) {
    state.savedOrderProduct = [];
    state.unsavedOrderProduct = [];
  }
};
const actions = {
  addOrderProduct({state, commit}, {storeProduct}) {
    /**
     * code check product status before add
     *
     * */
    const orderProduct = PosOrderStoreUtil.storeProductToOrderProduct(state, storeProduct);
    const item = state.unsavedOrderProduct.find(item => item.productGuid === orderProduct.productGuid);
    let quantity = 1;
    if (item) quantity = Number(item.orderProductQuantity) + 1;
    commit("SET_ORDER_PRODUCT_QUANTITY", {orderProduct, quantity});
  },
  checkOrderProductStatus({state, commit}) {
    const temp = state.savedOrderProduct.filter(od => od.orderProductStatus === state.orderProductStatus.CREATED ||
      od.orderProductStatus === state.orderProductStatus.PREPARING);
    if (!temp.length) {
      commit("CHANGE_SEAT_STATUS", {
        targetSeat: state.selectedSeat,
        seatStatus: state.seatStatus.NON_EMPTY,
        seatServiceStatus: state.seatServiceStatus.FINISHED
      });
    }
  },
  async serveOrderProduct({state, commit, dispatch}, {orderProduct, storeGuid}) {
    let orderProductChange = {
      storeGuid: storeGuid,
      orderProductGuid: orderProduct.guid,
    };
    await PosOrderProductService.serveOrderProduct(orderProductChange);
    commit("SET_ORDER_PRODUCT_STATUS", {
      orderProduct: orderProduct,
      status: state.orderProductStatus.SERVED
    });
    dispatch("checkOrderProductStatus");
  },
  async serveAllOrderProduct({state, commit, dispatch}) {
    const listPreparingOrderProduct = state.savedOrderProduct
      .filter(item => item.orderProductStatus === state.orderProductStatus.PREPARING);
    let orderProductServeDto = {
      storeGuid: state.currentStore.guid,
      orderGuid: state.currentOrder.guid,
      listOrderProductGuid: listPreparingOrderProduct.map(item => item.guid)
    };
    await PosOrderProductService.serveAllOrderProduct(orderProductServeDto);
    listPreparingOrderProduct.forEach(orderProduct => {
      commit("SET_ORDER_PRODUCT_STATUS", {
        orderProduct: orderProduct,
        status: state.orderProductStatus.SERVED
      });
    });
    dispatch("checkOrderProductStatus");
  },
  async cancelOrderProduct({state, commit}, {orderProduct, cancelReason, storeGuid}) {
    try {
      let orderProductChange = {
        storeGuid: storeGuid,
        orderProductGuid: orderProduct.guid,
        orderProductCancelReason: cancelReason
      };
      await PosOrderProductService.cancelOrderProduct(orderProductChange);
      MessageUtils.success("Hủy món thành công");
      commit("SET_ORDER_PRODUCT_STATUS", {
        orderProduct: orderProduct,
        status: state.orderProductStatus.CANCELLED_BY_EMPLOYEE
      });
    } catch (error) {
      MessageUtils.error(error.message || error.data.message);
    }
  }
};

const PosOrderProductStore = {
  namespaced: true,
  state,
  mutations,
  actions
};

export default PosOrderProductStore;
