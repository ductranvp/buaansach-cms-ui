/* Store module pattern */
const orderGroupSuffix = "_order_group";
const turnOnOrderGroupSuffix = "_turn_on_order_group";
const state = {
  turnOnOrderGroup: false,
  orderGroups: [],
};

const mutations = {
  SET_TURN_ON_ORDER_GROUP(state, status){
    state.turnOnOrderGroup = status;
    localStorage.setItem(state.currentStoreGuid + turnOnOrderGroupSuffix, JSON.stringify(status));
  },
  SET_ORDER_GROUPS(state, orderGroups){
    state.orderGroups = orderGroups;
    localStorage.setItem(state.currentStoreGuid + orderGroupSuffix, JSON.stringify(state.orderGroups));
  },
  ADD_ORDER_GROUP(state, orderGroup){
    state.orderGroups.push(orderGroup);
    localStorage.setItem(state.currentStoreGuid + orderGroupSuffix, JSON.stringify(state.orderGroups));
  },
  REMOVE_ORDER_GROUP(state, orderGroup){
    const idx = state.orderGroups.findIndex(item => item.orderGuid === orderGroup.orderGuid);
    state.orderGroups.splice(idx, 1);
    localStorage.setItem(state.currentStoreGuid + orderGroupSuffix, JSON.stringify(state.orderGroups));
  },
  RESET_ALL(state){
    state.turnOnOrderGroup = false;
    state.orderGroups = [];
    localStorage.removeItem(state.currentStoreGuid + orderGroupSuffix);
    localStorage.removeItem(state.currentStoreGuid + turnOnOrderGroupSuffix);
  }
};
const actions = {
  getStoreOrderGroup({state, commit}, storeGuid){
    let orderGroups = localStorage.getItem(storeGuid  + orderGroupSuffix) ? JSON.parse(localStorage.getItem(storeGuid  + orderGroupSuffix)) : [];
    let turnOnOrderGroup = localStorage.getItem(storeGuid  + turnOnOrderGroupSuffix) ? JSON.parse(localStorage.getItem(storeGuid  + turnOnOrderGroupSuffix)) : false;
    commit("SET_TURN_ON_ORDER_GROUP", turnOnOrderGroup);
    commit("SET_ORDER_GROUPS", orderGroups);
  }
};

const PosOrderGroupStore = {
  state,
  mutations,
  actions
};
export default PosOrderGroupStore;
