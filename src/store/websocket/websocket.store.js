/* Store module pattern */
import AuthUtils from "@/utils/auth.util";
import * as SockJS from "sockjs-client";
import * as Stomp from "webstomp-client";
import {Notification} from "element-ui";
import router from "@/router";
import Constants from "@/utils/constants";

const state = {
  pendingRoute: null,
  error: null,
  lostConnection: false,
  stompClient: null,
};
const mutations = {
  SET_CONNECTION(state, connection) {
    state.stompClient = connection;
  },
  SET_ERROR(state) {
    if (state.error == null) {
      state.lostConnection = true;
      state.pendingRoute = router.history.pending || router.history.current;
      setTimeout(() => {
        state.error = Notification.error({
          title: "Mất kết nối tới máy chủ!",
          message: "<span>Hãy kiểm tra các kết nối mạng!<br>Đang thực hiện kết nối lại...</span>",
          dangerouslyUseHTMLString: true,
          showClose: false,
          duration: 0
        });
      }, 200);
    }
  },
  CLEAR_ERROR(state) {
    if (state.error) {
      state.lostConnection = false;
      router.push(state.pendingRoute).catch(() => {
      });
      setTimeout(() => {
        Notification.success({
          title: "Kết nối thành công!",
          message: "Bạn có thể tiếp tục công việc.",
          duration: 5000
        });
      }, 500);

      setTimeout(() => {
        state.error.close();
        state.error = null;
      }, 1000);
    }
  }
};
const actions = {
  connect({state, commit, dispatch}) {
    let url = Constants.SERVER_API_URL + "/websocket?access_token=" + AuthUtils.getToken();
    let options = {debug: false, protocols: ['v12.stomp']};
    let socket = new SockJS(url);
    let stompClient = Stomp.over(socket, options);
    /* if has token => try to connect to ws */
    if (AuthUtils.getToken()) {
      stompClient.connect(
        {},
        function (frame) {
          if (state.error && state.pendingRoute.name === 'posPage') {
            dispatch("posMachine/initState", state.pendingRoute.params.storeGuid, {root: true});
          }
          commit("CLEAR_ERROR");
          commit("SET_CONNECTION", stompClient);
        },
        function (error) {
          commit("SET_ERROR");
          setTimeout(() => {
            dispatch("connect");
          }, 2000);
        }
      );
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
