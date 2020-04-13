const getters = {
  info: state => state.user.info,
  token: state => state.user.token,
  roles: state => state.user.roles,
  currentLanguage: state => state.currentLanguage,
  languages: state => state.languages,
  adminCurrentStore: state => state.adminStore.currentStore,
  adminSidebarCollapse: state => state.app.adminSidebarCollapse,
};
export default getters;
