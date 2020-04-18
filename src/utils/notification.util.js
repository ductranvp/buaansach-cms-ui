import {Notification} from "element-ui";
import i18n from "@/i18n";

const defaultDuration = 3000;
const NotificationUtils = {
    success(message, duration) {
        return Notification.success({
            title: i18n.t("app.notification.successTitle"),
            message: message,
            duration: duration !== undefined ? duration : defaultDuration
        });
    },
    error(message, duration) {
        return Notification.error({
            title: i18n.t("app.notification.errorTitle"),
            message: message,
            duration: duration !== undefined ? duration : defaultDuration
        });
    },
    warning(message, duration) {
        return Notification.warning({
            title: i18n.t("app.notification.warningTitle"),
            message: message,
            duration: duration !== undefined ? duration : defaultDuration
        });
    },
    info(message, duration) {
        return Notification.info({
            title: i18n.t("app.notification.infoTitle"),
            message: message,
            duration: duration !== undefined ? duration : defaultDuration
        });
    }
};
export default NotificationUtils;
