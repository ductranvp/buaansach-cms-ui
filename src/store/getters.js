const getters = {
  info: state => state.user.info,
  token: state => state.user.token,
  roles: state => state.user.roles,
  currentLanguage: state => state.translation.currentLanguage,
  languages: state => state.translation.languages,
  adminCurrentStore: state => state.adminStore.adminCurrentStore,
  adminSidebarCollapse: state => state.adminSetting.adminSidebarCollapse,
  websocket: state => state.websocket.stompClient,
  posMachine: state => state.posMachine
};
export default getters;
