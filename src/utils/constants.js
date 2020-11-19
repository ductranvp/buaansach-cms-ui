const Constants = {
    APP_MODE: process.env.VUE_APP_MODE_FLAG,
    SERVER_API_URL: process.env.VUE_APP_SERVER_API_URL,
    CUSTOMER_UI_URL: process.env.VUE_APP_CUSTOMER_UI_URL,
    CMS_UI_URL: process.env.VUE_APP_CMS_UI_URL,
    CUSTOMER_UI_SEAT_PREFIX_URL: process.env.VUE_APP_CUSTOMER_UI_URL + "/goi-mon/",
    CUSTOMER_UI_SEAT_RESUME_PARAM: "resume",
    APP_TITLE: "app.pageTitle",
    DEFAULT_LANGUAGE: "vi",
    DEFAULT_AREA_GUID: "all",
    DEFAULT_CATEGORY_GUID: "all",
    PHONE_REGEX: "^(09|03|07|08|05)+([0-9]{8})$",
    LOGIN_REGEX: "^[^_0-9][_0-9A-Za-z]{3,}$",
    COLOR: {
      PRIMARY: "#409EFF",
      SUCCESS: "#07a651",
      WARNING: "#e6a23c",
      DANGER: "#f56c6c",
      INFO: "#909399",
    },
  CMS_UI_DOMAIN: "CMS_UI_DOMAIN",
  CUSTOMER_UI_DOMAIN: "CUSTOMER_UI_DOMAIN",
  }
;
export default Constants;
