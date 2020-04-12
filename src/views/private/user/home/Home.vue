<template>
  <el-container class="full-size">
    <el-row class="full-size" type="flex" :gutter="10">
      <el-col :span="4" v-for="store in storeUser" :key="store.storeGuid">
        <el-card shadow="never">
          <div>
            <p>{{store.storeCode}} - {{store.storeName}}</p>
          </div>
          <div class="text-center">
            <el-button v-if="store.storeUserRole === 'OWNER' || store.storeUserRole === 'MANAGER'">Quản lý</el-button>
            <el-button v-else @click="goTo('posPage', store.storeGuid)">Bán hàng</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-container>
</template>

<script>
  import EmployeeStoreUserService from "@/service/employee/employee.store-user.service";
  import NotificationUtils from "@/utils/notification.util";

  export default {
    name: "Home",
    data() {
      return {
        isLoading: false,
        storeUser: [],
      };
    },
    created() {
      this.getStoreUser();
    },
    methods: {
      goTo(routeName, storeGuid) {
        // this.$router.push({name: routeName, params: {storeGuid: storeGuid}});
        let routeData = this.$router.resolve({name: routeName, params: {storeGuid: storeGuid}});
        window.open(routeData.href, '_blank');
      },
      async getStoreUser() {
        try {
          this.isLoading = true;
          this.storeUser = [];
          const {data} = await EmployeeStoreUserService.getListStoreUserByUser();
          this.storeUser = data;
          console.log(data);
          this.isLoading = false;
        } catch (error) {
          this.isLoading = false;
          NotificationUtils.error(error.message || error.data.message);
        }
      }
    }
  };
</script>

<style scoped></style>
