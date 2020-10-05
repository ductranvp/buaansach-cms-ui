import ErrorStringCode from '@/enum/ErrorStringCode';
import MessageUtils from '@/utils/message.util';
import AppUtils from '@/utils/app.util';

const ErrorUtils = {
  showErrorMessage(error, defaultMessage, duration){
    const stringCode = AppUtils.getStringErrorCode(error);
    let message = defaultMessage || "Đã có lỗi xảy ra";
    if (stringCode) {
      message = ErrorStringCode.label[stringCode] || stringCode;
    }
    MessageUtils.error(message, duration);
  },
  showActionErrorMessage(error, defaultMessage, duration){
    const stringCode = AppUtils.getStringErrorCode(error);
    let message = defaultMessage || "Đã có lỗi xảy ra, vui lòng thử lại sau";
    if (stringCode) {
      message = ErrorStringCode.label[stringCode] || stringCode;
    }
    MessageUtils.error(message, duration);
  },
};

export default ErrorUtils;
