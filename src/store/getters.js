const getters = {
  userInfo: state => state.user.info,
  authorities: state => state.user.authorities,
  websocket: state => state.websocket,
};
export default getters;
