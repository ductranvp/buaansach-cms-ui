import {Message} from 'element-ui';

const defaultDuration = 3000;
const MessageUtils = {
  success(message, duration) {
    return Message.success({
      message: message,
      duration: duration !== undefined ? duration : defaultDuration,
    });
  },
  error(message, duration) {
    return Message.error({
      message: message,
      duration: duration !== undefined ? duration : defaultDuration,
    });
  },
  warning(message, duration) {
    return Message.warning({
      message: message,
      duration: duration !== undefined ? duration : defaultDuration,
    });
  },
  info(message, duration) {
    return Message.info({
      message: message,
      duration: duration !== undefined ? duration : defaultDuration,
    });
  },
};
export default MessageUtils;
