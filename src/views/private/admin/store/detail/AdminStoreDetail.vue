<template>
  <el-container direction="vertical">
    <el-row v-if="storeGuid" class="full-size">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="tab in tabRoutes"
                     :label="$t(tab.title)"
                     :name="tab.routeName"
                     :key="tab.routeName"/>
        <transition name="fade-transform" mode="out-in">
          <router-view/>
        </transition>
      </el-tabs>
    </el-row>
  </el-container>
</template>

<script>
  import AdminStoreService from "@/service/admin/admin.store.service";
  import adminStoreDetailData from "@/views/private/admin/store/detail/admin-store-detail.data";
  import NotificationUtils from "@/utils/notification.util";

  export default {
    name: "AdminStoreDetail",
    mixins: [adminStoreDetailData],
    created() {
      this.storeGuid = this.$route.params.storeGuid;
      this.activeName = this.$route.name;
      this.getStoreDetail();
    },
    watch: {
      $route(to, from) {
        this.storeGuid = to.params.storeGuid;
        this.activeName = to.name;
      },
    },
    methods: {
      async getStoreDetail() {
        const vm = this;
        if (this.$route.params.storeGuid) {
          try {
            const {data} = await AdminStoreService.getStore(this.$route.params.storeGuid);
            this.$store.commit("adminStore/SET_CURRENT_STORE", data);
          } catch (error) {
            NotificationUtils.error(error.message || error.data.message);
          }
        }
      },
      handleClick(tab) {
        this.activeName = tab.name;
        if (tab.name !== this.$route.name) {
          this.$router.push({name: tab.name, params: {storeGuid: this.storeGuid}});
        }
      }
    }
  };
</script>

<style scoped></style>
