<template>
  <el-container class="full-size" direction="horizontal">
    <div class="text-center">
      <el-image
        style="width: 400px; height:225px"
        :src="currentStore.storeImageUrl"
        fit="cover"
        :preview-src-list="[currentStore.storeImageUrl]"
      >
        <div slot="error" class="image-error-slot full-size">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
    </div>
    <div>
      <table>
        <tr>
          <td>Store Code</td>
          <td>{{currentStore.storeCode}}</td>
        </tr>
        <tr>
          <td>Store Name</td>
          <td>{{currentStore.storeName}}</td>
        </tr>
        <tr>
          <td>Store Address</td>
          <td>{{currentStore.storeAddress}}</td>
        </tr>
        <tr>
          <td>Store Status</td>
          <td>{{currentStore.storeStatus}}</td>
        </tr>
        <tr>
          <td>Store Owner Name</td>
          <td>{{currentStore.storeOwnerName}}</td>
        </tr>
        <tr>
          <td>Store Owner Phone</td>
          <td>{{currentStore.storeOwnerPhone}}</td>
        </tr>
        <tr>
          <td>Store Owner Email</td>
          <td>{{currentStore.storeOwnerEmail}}</td>
        </tr>
        <tr>
          <td>Store Tax Code</td>
          <td>{{currentStore.storeTaxCode}}</td>
        </tr>
        <tr>
          <td>Store Open Hour</td>
          <td>{{currentStore.storeOpenHour}}</td>
        </tr>
        <tr>
          <td>Store Close Hour</td>
          <td>{{currentStore.storeCloseHour}}</td>
        </tr>
      </table>
    </div>
  </el-container>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: "AdminStoreDetailOverview",
    computed: {
      ...mapState({
        currentStore: state => state.adminStore.currentStore
      }),
    }
  }
  ;
</script>

<style scoped>

</style>
