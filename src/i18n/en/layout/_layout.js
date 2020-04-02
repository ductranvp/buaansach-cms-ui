import publicHeader from "./publicHeader";
import adminSidebar from "./adminSidebar";
import userHeader from "./userHeader";

const layoutText = {
  layout: {
    ...publicHeader,
    ...adminSidebar,
    ...userHeader
  }
};

export default layoutText;
