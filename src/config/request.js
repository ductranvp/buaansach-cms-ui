import axios from "axios";
import constants from "@/utils/constants";
import AuthUtils from "@/utils/auth.util";
import router from "@/router";

const baseUrl = constants.SERVER_API_URL;
const timeout = 10000; // 10 seconds

const request = axios.create({
  baseURL: baseUrl,
  timeout: timeout,
  headers: { "Content-Type": "application/json" } // default content type is json
});

/* Attach token for each request */
request.interceptors.request.use(
  function(config) {
    // do something before request is sent
    const token = AuthUtils.getToken();
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  function(error) {
    // do something with request error
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const errorCode = error.response.status || error.status || 0;
    switch (errorCode) {
      case 401:
        AuthUtils.logout("loginPage");
        break;
      case 403:
        router.push({ name: "forbiddenPage" }).then();
    }
    if (error.response) return Promise.reject(error.response);
    return Promise.reject(error);
  }
);

export default request;
