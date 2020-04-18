/* Store module pattern */
import AuthUtils from "@/utils/auth.util";
import * as SockJS from "sockjs-client";
import * as Stomp from "webstomp-client";
import {Notification} from "element-ui";
import router from "@/router";

const state = {
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
      router.push(router.history.pending).catch(() => {
      });
      setTimeout(() => {
        Notification.success({
          title: "Kết nối thành công!",
          message: "Bạn có thể tiếp tục công việc.",
          duration: 5000
        });
      }, 500);
      setTimeout(() => {
        router.push(state.currentRoute).catch(() => {
        });
        state.error.close();
        state.error = null;
      }, 1000);
    }
  }
};
const actions = {
  connect(store) {
    let url = "http://192.168.2.2/websocket?access_token=" + AuthUtils.getToken();
    let options = {debug: false, protocols: ['v12.stomp'], server:'Apache/1.3.9'};
    let socket = new SockJS(url);
    let stompClient = Stomp.over(socket, options);

    stompClient.connect(
      {},
      function (frame  ) {
        console.log(frame);
        console.log("Connected...");
        store.commit("CLEAR_ERROR");
        store.commit("SET_CONNECTION", stompClient);
        stompClient.subscribe("abc/def");
      },
      function (error) {
        store.commit("SET_ERROR");
        setTimeout(() => {
          console.log("Trying to reconnect...");
          store.dispatch("connect");
        }, 2000);
      }
    );
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
