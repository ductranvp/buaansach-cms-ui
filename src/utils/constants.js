const Constants = {
    SERVER_API_URL: process.env.VUE_APP_SERVER_API_URL,
    CUSTOMER_UI_SEAT_PREFIX_URL: process.env.VUE_APP_CUSTOMER_UI_URL + "/order/seat=",
    APP_TITLE: "app.pageTitle",
    DEFAULT_LANGUAGE: "vi",
    DEFAULT_AREA_GUID: "all",
    DEFAULT_CATEGORY_GUID: "all",
    PHONE_REGEX: "^(09|03|07|08|05)+([0-9]{8})$",
    COLOR: {
      PRIMARY: "#409EFF",
      SUCCESS: "#1c952f",
      WARNING: "#e6a23c",
      DANGER: "#f56c6c",
      INFO: "#909399",
    }
  }
;
export default Constants;
