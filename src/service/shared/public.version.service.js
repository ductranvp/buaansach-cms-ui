import request from "@/config/request";

const baseUrl = "/api/v1/public/version";
const PublicVersionService = {
  getLatestVersion(versionType) {
    return request.get(baseUrl + "/latest/" + versionType);
  }
};

export default PublicVersionService;
