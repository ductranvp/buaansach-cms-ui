import { Message } from "element-ui";

const defaultDuration = 3000;
const MessageUtils = {
  success(message, duration) {
    Message.success({
      title: "Success",
      message: message,
      duration: duration || defaultDuration
    });
  },
  error(message, duration) {
    Message.error({
      title: "Error",
      message: message,
      duration: duration || defaultDuration
    });
  },
  warning(message, duration) {
    Message.warning({
      title: "Warning",
      message: message,
      duration: duration || defaultDuration
    });
  },
  info(message, duration) {
    Message.info({
      title: "Info",
      message: message,
      duration: duration || defaultDuration
    });
  }
};
export default MessageUtils;
