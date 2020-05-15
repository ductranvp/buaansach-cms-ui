/* Store module pattern */
import AuthUtils from "@/utils/auth.util";
import * as SockJS from "sockjs-client";
import * as Stomp from "webstomp-client";
import Constants from "@/utils/constants";
import {Notification} from "element-ui";
import NotificationUtils from "@/utils/notification.util";

const state = {
  posStompClient: null,
  posSubscription: null,
  customerCareStompClient: null,
  customerCareSubscription: null,
  error: null,
};
const mutations = {
  SET_POS_STOMP_CLIENT(state, client) {
    state.posStompClient = client;
  },
  SET_CUSTOMER_CARE_STOMP_CLIENT(state, client) {
    state.customerCareStompClient = client;
  },
  SET_ERROR(state) {
    if (state.posSubscription){
      state.posSubscription.unsubscribe();
      state.posSubscription = null;
    }
    if (state.customerCareSubscription){
      state.customerCareSubscription.unsubscribe();
      state.customerCareSubscription = null;
    }
    if (!state.error) {
      state.error = Notification.error({
        title: "Mất kết nối tới máy chủ!",
        message: "<span>Hãy kiểm tra các kết nối mạng!<br>Đang thực hiện kết nối lại...</span>",
        dangerouslyUseHTMLString: true,
        showClose: false,
        duration: 0
      });
    }
  },
  CLEAR_ERROR(state) {
    if (state.error) {
      state.error.close();
      state.error = null;
      setTimeout(() => NotificationUtils.success("Kết nối lại thành công, tải lại trang để đảm bảo dữ liệu mới nhất"), 300);
    }
  },
  SET_POS_SUBSCRIPTION(state, posSubscription) {
    state.posSubscription = posSubscription;
  },
  SET_CUSTOMER_CARE_SUBSCRIPTION(state, customerCareSubscription) {
    state.customerCareSubscription = customerCareSubscription;
  },
};
const actions = {
  posConnect({state, commit, dispatch}, {onSuccess, onError}) {
    let url = Constants.SERVER_API_URL + "/websocket?access_token=" + AuthUtils.getToken();
    let options = {debug: false, protocols: ['v12.stomp']};
    let socket = new SockJS(url);
    let posStompClient = Stomp.over(socket, options);
    posStompClient.connect(
      {},
      function (frame) {
        if (state.error){
          commit("CLEAR_ERROR");
        }
        commit("SET_POS_STOMP_CLIENT", posStompClient);
        onSuccess(posStompClient);
      },
      function (error) {
        if (!state.error){
          commit("SET_ERROR");
        }
        commit("SET_POS_STOMP_CLIENT", null);
        onError(error);
        setTimeout(() => {
          dispatch("posConnect", {
            onSuccess: onSuccess,
            onError: onError
          });
        }, 2000);
      }
    );
  },
  customerCareConnect({state, commit, dispatch}, {onSuccess, onError}) {
    let url = Constants.SERVER_API_URL + "/websocket?access_token=" + AuthUtils.getToken();
    let options = {debug: false, protocols: ['v12.stomp']};
    let socket = new SockJS(url);
    let customerCareStompClient = Stomp.over(socket, options);
    customerCareStompClient.connect(
      {},
      function (frame) {
        if (state.error){
          commit("CLEAR_ERROR");
        }
        commit("SET_CUSTOMER_CARE_STOMP_CLIENT", customerCareStompClient);
        onSuccess(customerCareStompClient);
      },
      function (error) {
        if (!state.error){
          commit("SET_ERROR");
        }
        commit("SET_CUSTOMER_CARE_STOMP_CLIENT", null);
        onError(error);
        setTimeout(() => {
          dispatch("customerCareConnect", {
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
