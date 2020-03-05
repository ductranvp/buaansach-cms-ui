import { Notification } from "element-ui";

const defaultDuration = 3000;
const NotificationUtils = {
  success(message, duration) {
    Notification.success({
      title: "Success",
      message: message,
      duration: duration || defaultDuration
    });
  },
  error(message, duration) {
    Notification.error({
      title: "Error",
      message: message,
      duration: duration || defaultDuration
    });
  },
  warning(message, duration) {
    Notification.warning({
      title: "Warning",
      message: message,
      duration: duration || defaultDuration
    });
  },
  info(message, duration) {
    Notification.info({
      title: "Info",
      message: message,
      duration: duration || defaultDuration
    });
  }
};
export default NotificationUtils;
