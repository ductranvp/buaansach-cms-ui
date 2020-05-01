/* Store module pattern */
import AuthUtils from "@/utils/auth.util";
import * as SockJS from "sockjs-client";
import * as Stomp from "webstomp-client";
import {Notification} from "element-ui";
import router from "@/router";
import store from "@/store";
import Constants from "@/utils/constants";
import request from "@/config/request";

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
  SET_STATE_WHEN_JWT_EXPIRED(state) {
    state.lostConnection = false;
  },
  SET_ERROR(state) {
    if (state.error == null) {
      state.pendingRoute = router.history.pending || router.history.current;
      state.lostConnection = true;
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
      if (state.pendingRoute.name === 'posPage') {
        store.dispatch("posMachine/initState", state.pendingRoute.params.storeGuid);
      }
      router.push(state.pendingRoute);
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
  connect(store) {
    let url = Constants.SERVER_API_URL + "/websocket?access_token=" + AuthUtils.getToken();
    let options = {debug: false, protocols: ['v12.stomp']};
    let socket = new SockJS(url);
    let stompClient = Stomp.over(socket, options);
    /* if has token => try to connect to ws */
    if (AuthUtils.getToken()) {
      stompClient.connect(
        {},
        function (frame) {
          store.commit("CLEAR_ERROR");
          store.commit("SET_CONNECTION", stompClient);
        },
        function (error) {
          store.commit("SET_ERROR");
          setTimeout(() => {
            store.dispatch("connect");
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
