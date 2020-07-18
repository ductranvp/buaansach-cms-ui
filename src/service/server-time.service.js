import request from "@/config/request";

const baseUrl = "api/v1/public/server-time";
const ServerTimeService = {
  getServerTime() {
    return request.get(baseUrl + "/get");
  },
};

export default ServerTimeService;
