import PosSeatStore from '@/store/pos/modules/pos.seat.store';
import PosCategoryStore from '@/store/pos/modules/pos.category.store';
import PosAreaStore from '@/store/pos/modules/pos.area.store';
import PosStoreProductStore from '@/store/pos/modules/pos.store-product.store';
import PosOrderStore from '@/store/pos/modules/pos.order.store';
import PosStoreStore from '@/store/pos/modules/pos.store.store';
import PosOrderProductStore from '@/store/pos/modules/pos.order-product.store';
import DefaultEntity from '@/utils/default-entity';
import PosStoreNotificationStore
  from '@/store/pos/modules/pos.store-notification.store';

const state = {
  ready: false,
  ...PosSeatStore.state,
  ...PosAreaStore.state,
  ...PosCategoryStore.state,
  ...PosStoreProductStore.state,
  ...PosOrderStore.state,
  ...PosOrderProductStore.state,
  ...PosStoreStore.state,
  ...PosStoreNotificationStore.state,
};
const mutations = {
  SET_READY(state, ready) {
    state.ready = ready;
  },
  ...PosSeatStore.mutations,
  ...PosAreaStore.mutations,
  ...PosCategoryStore.mutations,
  ...PosStoreProductStore.mutations,
  ...PosOrderStore.mutations,
  ...PosOrderProductStore.mutations,
  ...PosStoreStore.mutations,
  ...PosStoreNotificationStore.mutations,
};
const actions = {
  ...PosSeatStore.actions,
  ...PosAreaStore.actions,
  ...PosCategoryStore.actions,
  ...PosStoreProductStore.actions,
  ...PosOrderStore.actions,
  ...PosOrderProductStore.actions,
  ...PosStoreStore.actions,
  ...PosStoreNotificationStore.actions,
  async initState({state, commit, dispatch}, storeGuid) {
    commit('SET_READY', false);
    const store = dispatch('getCurrentStore', storeGuid);
    const area = dispatch('getAllArea', storeGuid);
    const category = dispatch('getAllCategory', storeGuid);
    await Promise.all([store, area, category]);
    commit('SET_READY', true);
    dispatch('parseData');
  },
  parseData({dispatch}) {
    dispatch('changeArea', DefaultEntity.area.guid);
    dispatch('changeCategory', DefaultEntity.category.guid);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
