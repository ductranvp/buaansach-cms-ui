<template>
  <el-container class="full-size" direction="vertical">
    <el-main class="full-size padding-5">
      <el-row class="full-height flex-wrap" type="flex" align="top">
        <el-col class="padding-5" :lg="6" :md="8" :sm="12" :xs="24" v-for="store in storeUser" :key="store.storeGuid">
          <el-card :body-style="{ padding: '0px' }" shadow="never">
            <el-row>
              <el-image lazy class="image" fit="cover" :src="getMediaUrl(store.storeImageUrl) || defaultStoreImage">
                <div slot="error" class="image-error-slot full-size">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </el-row>
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
                    <td class="keep-break-line">{{store.storeBusinessHours}}</td>
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
                  v-if="store.storeUserRole === storeUserRole.STORE_OWNER || store.storeUserRole === storeUserRole.STORE_MANAGER
                  || hasAnyRole([authority.ROLE_ADMIN])">
                  <el-button v-if="hasAnyRole([authority.ROLE_ADMIN])" type="success" plain class="full-width" size="medium"
                             @click="goTo('adminStoreDetailOverviewPage', store.storeGuid)">
                    <i class="el-icon-s-tools"></i>
                    <span>Quản lý</span>
                    <i v-if="openNewTab" class="el-icon-top-right"></i>
                  </el-button>
                  <el-button v-else type="success" plain class="full-width" size="medium"
                             @click="goTo('saleReportPage', store.storeGuid)">
                    <i class="el-icon-s-data"></i>
                    <span>Thống kê</span>
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
  import StoreUserService from "@/service/shared/store-user.service";
  import NotificationUtils from "@/utils/notification.util";
  import hasAnyRole from "@/utils/has-any-role";
  import StoreUserRole from '@/enum/StoreUserRole';
  import Authority from '@/enum/Authority';
  import ErrorUtils from '@/utils/error.util';

  export default {
    name: "Home",
    data() {
      return {
        isLoading: false,
        openNewTab: false,
        storeUser: [],
        storeUserRole: StoreUserRole.value,
        authority: Authority.value
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
          ErrorUtils.showErrorMessage(error);
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
