import pageTitle from "./_pageTitle";
import adminStoreListPage from "./adminStoreListPage";
import adminStoreDetailPage from "./adminStoreDetailPage";
import adminStoreDetailAreaPage from "./adminStoreDetailAreaPage";
import adminStoreDetailSeatPage from "./adminStoreDetailSeatPage";

const privateText = {
  private: {
    ...pageTitle,
    ...adminStoreListPage,
    ...adminStoreDetailPage,
    ...adminStoreDetailAreaPage,
    ...adminStoreDetailSeatPage
  }
};

export default privateText;
