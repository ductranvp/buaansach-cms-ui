import Constants from "@/utils/constants";

const methods = {
  getMediaUrl(uri) {
    const mediaHost = Constants.SERVER_API_URL;
    if (uri && !uri.startsWith("http")) {
      uri = mediaHost + uri;
    }
    return uri;
  },
};

export default methods;
