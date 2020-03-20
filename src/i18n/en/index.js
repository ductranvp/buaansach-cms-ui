import admin from "./admin";
import employee from "./employee";
import manager from "./manager";

const enMessage = {
  ...admin,
  ...employee,
  ...manager
};

export default enMessage;
