import axios from "axios";
import constants from "@/utils/constants";
import AuthUtils from "@/utils/auth.util";
import router from "@/router";
import store from "@/store";
import AppUtils from '@/utils/app.util';

const baseUrl = constants.SERVER_API_URL;
const timeout = 100000; // 100 seconds

const request = axios.create({
  baseURL: baseUrl,
  timeout: timeout,
  headers: {"Content-Type": "application/json"} // default content type is json
});

/* Attach token for each request */
request.interceptors.request.use(
  function (config) {
    // do something before request is sent
    const token = AuthUtils.getToken();
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    config.url += "?cacheBuster=" + (new Date()).getTime();
    return config;
  },
  function (error) {
    // do something with request error
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const errorCode = AppUtils.getNumberErrorCode(error.response);
    if (errorCode === 401) {
      AuthUtils.logout().then(null);
    }
    if (errorCode === 403) {
      store.dispatch("user/getAccount");
      router.push({name: "forbiddenPage"});
    }
    return Promise.reject(error.response);
  }
);

export default request;
