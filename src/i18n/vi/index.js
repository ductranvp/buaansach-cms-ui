import admin from "./admin";
import employee from "./employee";
import manager from "./manager";

const viMessage = {
  ...admin,
  ...employee,
  ...manager
};

export default viMessage;
