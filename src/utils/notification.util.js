import { Notification } from "element-ui";
import i18n from "@/i18n";

const defaultDuration = 3000;
const NotificationUtils = {
  success(message, duration) {
    Notification.success({
      title: i18n.t("app.notification.successTitle"),
      message: message,
      duration: duration || defaultDuration
    });
  },
  error(message, duration) {
    Notification.error({
      title: i18n.t("app.notification.errorTitle"),
      message: message,
      duration: duration || defaultDuration
    });
  },
  warning(message, duration) {
    Notification.warning({
      title: i18n.t("app.notification.warningTitle"),
      message: message,
      duration: duration || defaultDuration
    });
  },
  info(message, duration) {
    Notification.info({
      title: i18n.t("app.notification.infoTitle"),
      message: message,
      duration: duration || defaultDuration
    });
  }
};
export default NotificationUtils;
