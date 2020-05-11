/* Store module pattern */
import AuthUtils from "@/utils/auth.util";
import * as SockJS from "sockjs-client";
import * as Stomp from "webstomp-client";
import Constants from "@/utils/constants";

const state = {};
const mutations = {};
const actions = {
  connect({state, commit, dispatch}, {onSuccess, onError}) {
    let url = Constants.SERVER_API_URL + "/websocket?access_token=" + AuthUtils.getToken();
    let options = {debug: false, protocols: ['v12.stomp']};
    let socket = new SockJS(url);
    let stompClient = Stomp.over(socket, options);
    stompClient.connect(
      {},
      function (frame) {
        onSuccess(stompClient);
      },
      function (error) {
        onError(error);
        setTimeout(() => {
          dispatch("connect", {
            onSuccess: onSuccess,
            onError: onError
          });
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
