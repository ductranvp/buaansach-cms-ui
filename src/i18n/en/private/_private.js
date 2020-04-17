import pageTitle from "./_pageTitle";
import adminStoreManagementPage from "./adminStoreManagementPage";
import adminStoreDetailPage from "./adminStoreDetailPage";
import adminStoreDetailAreaPage from "./adminStoreDetailAreaPage";
import adminStoreDetailSeatPage from "./adminStoreDetailSeatPage";
import adminStoreDetailHumanPage from "./adminStoreDetailHumanPage";

const privateText = {
  private: {
    ...pageTitle,
    ...adminStoreManagementPage,
    ...adminStoreDetailPage,
    ...adminStoreDetailAreaPage,
    ...adminStoreDetailSeatPage,
    ...adminStoreDetailHumanPage
  }
};

export default privateText;
