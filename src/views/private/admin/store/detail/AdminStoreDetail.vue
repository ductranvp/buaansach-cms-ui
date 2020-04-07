<template>
  <el-container direction="vertical">
    <el-row :gutter="10" type="flex">
      <el-col :span="10" :xs="24">
        <el-autocomplete
          v-model="searchKey"
          :fetch-suggestions="queryStore"
          :value-key="'storeName'"
          :placeholder="$t('private.adminStoreDetailPage.searchPlaceholder')"
          :debounce="queryDebounce"
          clearable
          @select="handleSelect"
          class="full-width"
        >
          <template slot-scope="{item}">
            <!--         {{item}}-->
            <span>{{item.storeCode}} - {{item.storeName}}</span>
          </template>
        </el-autocomplete>
      </el-col>
    </el-row>
    <el-row v-if="storeGuid" class="margin-top-10 full-size">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="tab in tabRoutes"
                     :label="$t(tab.title)"
                     :name="tab.routeName"
                     :key="tab.routeName"/>
      </el-tabs>
      <transition name="fade-transform" mode="out-in">
        <router-view :key="key"/>
      </transition>
    </el-row>
  </el-container>
</template>

<script>
  import StoreService from "@/service/store.service";
  import adminStoreDetailData from "@/views/private/admin/store/detail/admin-store-detail.data";

  export default {
    name: "AdminStoreDetail",
    mixins: [adminStoreDetailData],
    computed: {
      key() {
        return this.$route.path;
      }
    },
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
      async queryStore(queryString, cb) {
        try {
          if (queryString) {
            const {data} = await StoreService.getListStore({search: queryString});
            cb(data.content);
          } else {
            cb([]);
          }
        } catch (e) {
          // console.log(e);
        }
      },
      handleSelect(selectedStore) {
        const currentRouteName = this.$route.name !== "adminStoreDetailPage" ? this.$route.name : "adminStoreDetailOverviewPage";
        if (this.$route.params.storeGuid !== selectedStore.guid) {
          this.$router.push({name: currentRouteName, params: {storeGuid: selectedStore.guid}});
          this.getStoreDetail();
        }
      },
      async getStoreDetail() {
        const vm = this;
        if (this.$route.params.storeGuid) {
          const {data} = await StoreService.getStore(this.$route.params.storeGuid);
          this.$store.commit("adminStore/SET_CURRENT_STORE", data);
          vm.searchKey = data.storeName;
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
