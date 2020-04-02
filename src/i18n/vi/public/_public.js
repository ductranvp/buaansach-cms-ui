import pageTitle from "./_pageTitle";
import loginPage from "./loginPage";
import resetPassword from "./resetPassword";

const publicText = {
  public: {
    ...pageTitle,
    ...loginPage,
    ...resetPassword
  }
};

export default publicText;
