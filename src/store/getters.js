const getters = {
  info: state => state.user.info,
  token: state => state.user.token,
  roles: state => state.user.roles,
  langKey: state => state.user.langKey
};
export default getters;
