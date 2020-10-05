<template>
  <el-row type="flex" align="middle">
    <el-col :span="4" :xs="24">
      <el-image class="store-image" :src="getMediaUrl(row.storeImageUrl)" fit="cover" :preview-src-list="[getMediaUrl(row.storeImageUrl)]">
        <div slot="error" class="image-error-slot full-size">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
    </el-col>
    <el-col :span="20" :xs="24">
      <el-row type="flex">
        <el-col :span="11">
          <table class="expanded-table">
            <tr>
              <td>{{ $t("private.adminStoreManagementPage.store.storeAddress") }}</td>
              <td>{{ row.storeAddress }}</td>
            </tr>
            <tr>
              <td>{{ $t("private.adminStoreManagementPage.store.storeOwnerEmail") }}</td>
              <td>{{ row.storeOwnerEmail }}</td>
            </tr>
            <tr>
              <td>{{ $t("private.adminStoreManagementPage.store.storeTaxCode") }}</td>
              <td>{{ row.storeTaxCode }}</td>
            </tr>
          </table>
        </el-col>
        <el-col :span="2">
          <el-divider direction="vertical" class="full-height"></el-divider>
        </el-col>
        <el-col :span="11">
          <table class="expanded-table">
            <tr>
              <td>{{$t("private.adminStoreManagementPage.activeTime")}}</td>
              <td class="keep-break-line">{{ row.storeBusinessHours }}</td>
            </tr>
            <tr>
              <td>{{ $t("common.entity.audit.lastModifiedDate") }}</td>
              <td>{{ row.lastModifiedDate | moment("HH:mm - DD/MM/YYYY") }}</td>
            </tr>
            <tr>
              <td>{{ $t("common.entity.audit.lastModifiedBy") }}</td>
              <td>{{ row.lastModifiedBy }}</td>
            </tr>
          </table>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>

  export default {
    name: "AdminStoreManagementRowDetail",
    props: {
      row: {
        type: Object,
        required: true
      }
    },
    methods: {}
  };
</script>

<style scoped>
  .store-image {
    width: 160px;
    height: 90px
  }

  .expanded-table {
    width: 100%;
  }

  .expanded-table tr td {
    border: none;
  }
</style>
