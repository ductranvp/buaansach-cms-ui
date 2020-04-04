import {MessageBox} from "element-ui";
import i18n from "@/i18n";

const MessageBoxUtils = {
    showAlert(title, message, isHTML, callback) {
        MessageBox.alert(message, title, {
            confirmButtonText: i18n.t("app.messageBox.okBtn"),
            dangerouslyUseHTMLString: isHTML
        }).then(() => {
            if (callback) callback();
        });
    },
    // eslint-disable-next-line no-unused-vars
    prompt(title, message, isHTML, initValue, callback) {
        MessageBox.prompt(message, title, {
            confirmButtonText: i18n.t("app.messageBox.okBtn"),
            cancelButtonText: i18n.t("app.messageBox.cancelBtn"),
            inputValue: initValue,
            dangerouslyUseHTMLString: isHTML
        })
            .then(val => {
                if (callback) callback(val);
            })
            .catch(() => {
            });
    },
    confirm(message, callback) {
        MessageBox.confirm(message, i18n.t("app.messageBox.confirmTitle") + "", {
            confirmButtonText: i18n.t("app.messageBox.okBtn"),
            cancelButtonText: i18n.t("app.messageBox.cancelBtn"),
            type: "warning"
        })
            .then(() => {
                if (callback) callback();
            })
            .catch(() => {
            });
    }
};
export default MessageBoxUtils;
