const computed = {
  currentUser() {
    return this.$store.state.user.userInfo;
  },
  isAuthenticated() {
    return this.$store.state.user.isAuthenticated;
  }
};

export default computed;
