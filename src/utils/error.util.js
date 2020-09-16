import ErrorCode from '@/enum/ErrorCode';
import MessageUtils from '@/utils/message.util';

const ErrorUtils = {
  showErrorMessage(error, duration){
    const errorCode = error.message || error.data.message;
    const message = ErrorCode.label[errorCode];
    MessageUtils.error(message, duration);
  }
};

export default ErrorUtils;
