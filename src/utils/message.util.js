import { Message } from "element-ui";
import i18n from "@/i18n";

const defaultDuration = 3000;
const MessageUtils = {
  success(message, duration) {
    Message.success({
      title: i18n.t("app.notification.successTitle"),
      message: message,
      duration: duration || defaultDuration
    });
  },
  error(message, duration) {
    Message.error({
      title: i18n.t("app.notification.errorTitle"),
      message: message,
      duration: duration || defaultDuration
    });
  },
  warning(message, duration) {
    Message.warning({
      title: i18n.t("app.notification.warningTitle"),
      message: message,
      duration: duration || defaultDuration
    });
  },
  info(message, duration) {
    Message.info({
      title: i18n.t("app.notification.infoTitle"),
      message: message,
      duration: duration || defaultDuration
    });
  }
};
export default MessageUtils;
