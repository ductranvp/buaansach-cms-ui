<template>
  <div>
    <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="tab in tabRoutes"
                   :label="$t(tab.title)"
                   :name="tab.routeName"
                   :key="tab.routeName"/>
    </el-tabs>
    <div>
      <transition name="fade-transform" mode="out-in">
        <router-view :key="key"/>
      </transition>
    </div>
  </div>
</template>

<script>
  import StoreService from "@/service/store.service";

  export default {
    name: "AdminStoreDetail",
    computed: {
      key() {
        return this.$route.path;
      }
    },
    data() {
      return {
        activeName: 'adminStoreDetailOverviewPage',
        storeGuid: null,
        tabRoutes: [
          {
            routeName: "adminStoreDetailOverviewPage",
            title: "private.adminStoreDetailPage.tabs.overview"
          },
          {
            routeName: "adminStoreDetailHumanPage",
            title: "private.adminStoreDetailPage.tabs.human"
          },
          {
            routeName: "adminStoreDetailSalePage",
            title: "private.adminStoreDetailPage.tabs.sale"
          },
          {
            routeName: "adminStoreDetailWorkShiftPage",
            title: "private.adminStoreDetailPage.tabs.workShift"
          },
          {
            routeName: "adminStoreDetailSeatPage",
            title: "private.adminStoreDetailPage.tabs.seat"
          },
          {
            routeName: "adminStoreDetailSettingPage",
            title: "private.adminStoreDetailPage.tabs.setting"
          }
        ],
        storeEntity: {
          guid: null,
          storeCode: null,
          storeName: null,
          storeAddress: null,
          storeImageUrl: null,
          storeStatus: null,
          storeOwnerName: null,
          storeOwnerPhone: null,
          storeOwnerEmail: null,
          storeTaxCode: null,
          lastUpdateReason: null,
          storeOwnerLogin: null,
          createdDate: null,
          createdBy: null,
          lastModifiedDate: null,
          lastModifiedBy: null
        }
      };
    },
    mounted() {
      this.storeGuid = this.$route.params.storeGuid;
      this.activeName = this.$route.name;
      this.getStoreDetail();
    },
    methods: {
      getStoreDetail() {
        if (this.$route.params.storeGuid) {
          StoreService.getStore(this.$route.params.storeGuid).then(response => {
            console.log(response);
          });
        }
      },
      handleClick(tab, event) {
        this.activeName = tab.name;
        this.$router.push({name: tab.name, params: {storeGuid: this.storeGuid}});
      }
    }
  };
</script>

<style scoped></style>
