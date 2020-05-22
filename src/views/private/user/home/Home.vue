<template>
  <el-container class="full-size" direction="vertical">
    <el-main class="full-size padding-5">
      <el-row class="full-height flex-wrap" type="flex" align="top">
        <el-col class="padding-5" :lg="6" :md="8" :sm="12" :xs="24" v-for="store in storeUser" :key="store.storeGuid">
          <el-card :body-style="{ padding: '0px' }" shadow="never">
            <img :src="store.storeImageUrl" class="image">
            <el-divider class="margin-0"></el-divider>
            <el-container class="padding-20" direction="vertical">
              <div style="min-height: 100px">
                <table>
                  <tr>
                    <td>Mã cửa hàng:</td>
                    <td>{{store.storeCode}}</td>
                  </tr>
                  <tr>
                    <td>Tên cửa hàng:</td>
                    <td>{{store.storeName}}</td>
                  </tr>
                  <tr>
                    <td>Chủ cửa hàng:</td>
                    <td>{{store.storeOwnerName}}</td>
                  </tr>
                  <tr>
                    <td>Liên hệ:</td>
                    <td>{{store.storeOwnerPhone}}</td>
                  </tr>
                  <tr>
                    <td>Giờ hoạt động:</td>
                    <td>{{store.storeOpenHour}} - {{store.storeCloseHour}}</td>
                  </tr>
                </table>
              </div>
              <el-row :gutter="10" type="flex" class="text-center margin-top-10">
                <el-col>
                  <el-button type="success" plain class="full-width" size="medium"
                             @click="goTo('posPage', store.storeGuid)">
                    <i class="el-icon-s-order"></i>
                    <span>Bán hàng</span>
                    <i v-if="openNewTab" class="el-icon-top-right"></i>
                  </el-button>
                </el-col>
                <el-col
                  v-if="store.storeUserRole === 'STORE_OWNER' || store.storeUserRole === 'STORE_MANAGER' || hasAnyRole(['ROLE_ADMIN'])">
                  <el-button v-if="hasAnyRole(['ROLE_ADMIN'])" type="success" plain class="full-width" size="medium"
                             @click="goTo('adminStoreDetailOverviewPage', store.storeGuid)">
                    <i class="el-icon-s-tools"></i>
                    <span>Quản lý</span>
                    <i v-if="openNewTab" class="el-icon-top-right"></i>
                  </el-button>
                  <el-button v-else type="success" plain class="full-width" size="medium"
                             @click="goTo('partnerDashboardPage', store.storeGuid)">
                    <i class="el-icon-s-tools"></i>
                    <span>Quản lý</span>
                    <i v-if="openNewTab" class="el-icon-top-right"></i>
                  </el-button>
                </el-col>
              </el-row>
            </el-container>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
  import StoreUserService from "@/service/common/store-user.service";
  import NotificationUtils from "@/utils/notification.util";
  import hasAnyRole from "@/utils/has-any-role";

  export default {
    name: "Home",
    data() {
      return {
        isLoading: false,
        openNewTab: false,
        storeUser: [],
      };
    },
    created() {
      this.getStoreUser();
    },
    methods: {
      hasAnyRole: hasAnyRole,
      goTo(routeName, storeGuid) {
        if (this.openNewTab) {
          let routeData = this.$router.resolve({name: routeName, params: {storeGuid: storeGuid}});
          window.open(routeData.href, '_blank');
        } else {
          this.$router.push({name: routeName, params: {storeGuid: storeGuid}});
        }
      },
      async getStoreUser() {
        try {
          this.isLoading = true;
          this.storeUser = [];
          const {data} = await StoreUserService.getListStoreUserByUser();
          this.storeUser = data;
          this.isLoading = false;
        } catch (error) {
          this.isLoading = false;
          NotificationUtils.error(error.message || error.data.message);
        }
      }
    }
  };
</script>

<style scoped>
  .image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
  }

  th, td {
    font-weight: 600;
    padding-bottom: 15px;
    text-align: left;
  }
</style>
