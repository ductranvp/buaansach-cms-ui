/* Store module pattern */
import AuthUtils from "@/utils/auth.util";
import * as SockJS from "sockjs-client";
import * as Stomp from "webstomp-client";
import Constants from "@/utils/constants";
import { Notification } from "element-ui";
import NotificationUtils from "@/utils/notification.util";
import WebsocketConstants from "@/utils/websocket.constants";
import CloudFlareService from "@/service/shared/cloudflare.service";
import AppUtils from "@/utils/app.util";
import WebsocketEndpoints from "@/utils/websocket.endpoints";
import router from "@/router";

const state = {
  wsError: null,
  wsConnected: false,
  wsStompClient: null,
  hasExecutedConnect: false,
  maxRetry: 10,
  retryCount: 0
};
const mutations = {
  SET_RETRY_COUNT(state, num) {
    state.retryCount = num;
  },
  INCREASE_RETRY(state) {
    state.retryCount++;
  },
  SET_HAS_EXECUTED_CONNECT(state, status) {
    state.hasExecutedConnect = status;
  },
  SET_STOMP_CLIENT(state, client) {
    // disconnect previous connection if exist
    if (state.wsStompClient) {
      try {
        state.wsStompClient.disconnect();
      } catch (e) {
        // do nothing
      }
    }
    state.wsStompClient = client;
  },
  SET_CONNECTED(state, status) {
    state.wsConnected = status;
  },
  SET_ERROR(state) {
    if (!state.wsError) {
      state.wsError = Notification.error({
        title: "Lỗi kết nối tới máy chủ!",
        message:
          "<span>Tải lại trang hoặc kiểm tra các kết nối mạng!<br>Đang thực hiện kết nối lại..</span>",
        dangerouslyUseHTMLString: true,
        showClose: false,
        duration: 0
      });
    }
  },
  CLEAR_ERROR(state) {
    if (state.wsError) {
      state.wsError.close();
      state.wsError = null;
      setTimeout(
        () =>
          NotificationUtils.success(
            "Kết nối lại thành công, tải lại trang để đảm bảo dữ liệu mới nhất"
          ),
        300
      );
    }
  }
};
const actions = {
  connectWS({ state, commit, dispatch }) {
    /* WS will automatic reconnect when disconnected, so this function must be called once */
    if (!AuthUtils.getToken()) {
      dispatch("disconnectWS");
      return;
    }

    commit("SET_HAS_EXECUTED_CONNECT", true);

    let url =
      Constants.SERVER_API_URL +
      "/websocket?access_token=" +
      AuthUtils.getToken();
    let options = { debug: false, protocols: ["v12.stomp"] };
    let socket = new SockJS(url);
    let stompClient = Stomp.over(socket, options);
    stompClient.connect(
      {},
      function(frame) {
        commit("SET_CONNECTED", true);
        commit("SET_STOMP_CLIENT", stompClient);
        commit("CLEAR_ERROR");
        commit("SET_RETRY_COUNT", 0);
        dispatch("sendActivity", {});
      },
      function(error) {
        commit("SET_CONNECTED", false);
        commit("SET_STOMP_CLIENT", null);
        commit("SET_ERROR");
        setTimeout(() => {
          commit("INCREASE_RETRY");
          if (state.retryCount < state.maxRetry) {
            dispatch("connectWS");
          } else {
            alert(
              "Không thể tự kết nối lại với máy chủ, trang web sẽ được tải lại."
            );
            location.reload();
          }
        }, WebsocketConstants.RECONNECT_DELAY);
      }
    );
  },
  // use when logout only
  disconnectWS({ state, commit }) {
    if (state.wsStompClient) {
      state.wsStompClient.disconnect();
    }
    commit("CLEAR_ERROR");
    commit("SET_CONNECTED", false);
    commit("SET_STOMP_CLIENT", null);
    commit("SET_HAS_EXECUTED_CONNECT", false);
  },
  async sendActivity({ state }, activity) {
    activity.cloudFlareTrace = {};
    try {
      const { data } = await CloudFlareService.getCouldFlareTrace();
      activity.cloudFlareTrace = AppUtils.parseCloudFlareTrace(data);
    } catch (e) {
      // error get cloudFlare trace
    }
    state.wsStompClient.send(
      WebsocketEndpoints.APP_ACTIVITY, // destination
      JSON.stringify(activity), // body
      {} // header
    );
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
