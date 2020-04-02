import pageTitle from "./_pageTitle";
import adminStoreListPage from "./adminStoreListPage";
import adminStoreDetailPage from "./adminStoreDetailPage";

const privateText = {
  private: {
    ...pageTitle,
    ...adminStoreListPage,
    ...adminStoreDetailPage
  }
};

export default privateText;
