import { MessageBox } from "element-ui";

const MessageBoxUtils = {
  // eslint-disable-next-line no-unused-vars
  prompt(title, message, callback) {
    MessageBox.prompt(message, title, {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "info"
    })
      .then(val => {
        console.log(val);
      })
      .catch(() => {});
  },
  confirm(message, callback) {
    MessageBox.confirm(message, "Confirm", {
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      type: "warning"
    })
      .then(() => {
        if (callback) callback();
      })
      .catch(() => {});
  }
};
export default MessageBoxUtils;
