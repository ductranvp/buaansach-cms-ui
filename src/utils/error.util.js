import router from "@/router";

const ErrorUtils = {
  blockAccessToStore(storeGuid) {
    router.push({
      name: "forbiddenPage", params: {
        errorMessage: "<span class='text-center text-light'>Bạn không có quyền truy cập cửa hàng này!<br>" +
          "Nếu đây là lỗi, hãy gửi yêu cầu tại <a class='text-light' href=\"/\">đây</a><br>" +
          "Cảm ơn!</span>"
      }
    }).then(r => {
    });
  }
};

export default ErrorUtils;
