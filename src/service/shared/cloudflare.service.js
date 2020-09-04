import axios from "axios";

const url = "https://www.cloudflare.com/cdn-cgi/trace";
const CloudFlareService = {
  getCouldFlareTrace() {
    return axios.get(url);
  }
};

export default CloudFlareService;
